# Virada do Memoriar para o PostgreSQL da BQTECH

Roteiro para trocar o Supabase pelo container `bqtech-postgres` (PostgreSQL 17) na VM
`bqtech-app01`. O banco `memoriar_db` e o role `memoriar_user` já existem; o arquivo
`/opt/bqtech/projects/memoriar/.secrets/database.env` já contém `DATABASE_URL`.

Nada aqui exibe ou versiona credenciais. Execute os comandos na VM, dentro de
`/opt/bqtech/projects/memoriar`, como o usuário que hoje administra os containers.

## Por que a ordem importa

- O timer `bqtech-memoriar-update` aplica a imagem `:latest` a cada 5 minutos.
- O serviço `memoriar-migrate` usa `node dist/db/cli.js`, que só existe na imagem nova. Se o compose
  do servidor mudar antes de a imagem nova ser publicada, a migration falha e a API não sobe.
- A imagem nova exige `DATABASE_URL` e `JWT_SECRET`. Se ela entrar antes de o compose ser
  atualizado, a API não sobe.

Por isso: pausar o timer, preparar segredos, publicar a imagem e só então trocar o compose.

## 1. Pausar a atualização automática

```bash
sudo systemctl stop bqtech-memoriar-update.timer
```

## 2. Conferir o banco (somente leitura)

O `memoriar_user` precisa ser dono do `memoriar_db` para criar as tabelas e a extensão `pg_trgm`.

```bash
docker exec bqtech-postgres psql -U bqtech_admin -d postgres -Atc \
  "select pg_get_userbyid(datdba) from pg_database where datname = 'memoriar_db'"
```

- Resultado `memoriar_user`: siga em frente.
- Outro valor: ajuste uma vez com
  `docker exec bqtech-postgres psql -U bqtech_admin -d postgres -c "alter database memoriar_db owner to memoriar_user"`.

Confira, sem imprimir a senha, se a URL aponta para o container e o banco certos:

```bash
grep -c '^DATABASE_URL=postgres\(ql\)\?://memoriar_user:.*@bqtech-postgres:5432/memoriar_db' .secrets/database.env
```

O resultado deve ser `1`. Se a senha tiver caracteres especiais (`@ : / ? #`), eles precisam estar
codificados em URL (por exemplo, `@` vira `%40`).

## 3. Criar o segredo dos tokens

```bash
printf 'JWT_SECRET=%s\n' "$(openssl rand -base64 48 | tr -d '\n/+=')" >> .secrets/runtime.env
chmod 600 .secrets/runtime.env
```

As variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` podem continuar no arquivo até o fim da virada;
a imagem nova as ignora.

## 4. Publicar a imagem nova

Faça o merge da branch `feat/postgres-local` em `main` e espere o workflow
"BQTECH CI and Containers" publicar `memoriar-web` e `memoriar-api`. Anote a tag
`sha-<commit>` da versão anterior para o rollback (`docker image ls ghcr.io/brenoqn/memoriar-api`).

## 5. Atualizar o compose operacional

Em `/opt/bqtech/projects/memoriar/compose.yaml`, alinhe com `compose.production.yaml` do
repositório:

- serviço `memoriar-migrate` (mesma imagem da API, `command: ["node", "dist/db/cli.js", "migrate"]`,
  `restart: "no"`, rede `bqtech-data`, `env_file: .secrets/database.env`);
- na API: `env_file` com `.secrets/runtime.env` **e** `.secrets/database.env`, `depends_on` do
  `memoriar-migrate` com `condition: service_completed_successfully` e a rede externa `bqtech-data`
  além da rede interna atual;
- remova `USE_MOCKS` do `environment` da API;
- declare `bqtech-data` em `networks` com `external: true`.

Depois:

```bash
docker compose config --quiet && docker compose pull && docker compose up -d
docker compose logs memoriar-migrate    # deve mostrar "Migrations aplicadas: 0001_initial_schema"
```

## 6. Criar o primeiro administrador

A senha é lida da entrada padrão para não aparecer no histórico do shell. Mínimo de 12 caracteres.

```bash
read -rsp 'Senha do admin: ' PW; echo
printf '%s\n' "$PW" | docker compose run --rm -T -e ADMIN_EMAIL='seu-email@dominio.com.br' \
  memoriar-migrate node dist/db/cli.js create-admin
unset PW
```

Use `ADMIN_ROLE=editor` para editores e `--update` no fim do comando para redefinir a senha de um
usuário existente.

## 7. Dados demonstrativos (opcional)

O seed cria o "Cemitério Municipal Central (demonstração)" com cinco casos fictícios, visíveis na
busca pública. Aplique só se quiser exibir a demonstração em produção:

```bash
docker compose run --rm memoriar-migrate node dist/db/cli.js seed
```

## 8. Validar

```bash
docker compose ps
docker exec bqtech-memoriar-api wget -qO- http://127.0.0.1:3001/health   # {"ok":true,"database":"ok"}
curl -s 'https://memoriar.bqtech.com.br/api/public/search?q=maria'
```

- Faça login em `https://memoriar.bqtech.com.br/admin/login` com o usuário criado.
- Abra a visão geral e a qualidade de dados.
- Confira `docker compose logs --since 10m memoriar-api` (não deve haver `falhou:`).

O `/health` agora consulta o banco: se ele responder 200, a API está conectada ao Postgres.

## 9. Concluir

```bash
sudo systemctl start bqtech-memoriar-update.timer
```

Remova `SUPABASE_URL` e `SUPABASE_ANON_KEY` de `.secrets/runtime.env` e encerre o projeto no Supabase
quando estiver seguro.

## Rollback

O banco novo começa vazio e não é usado pela versão anterior, então voltar não exige restaurar
dados:

1. `sudo systemctl stop bqtech-memoriar-update.timer`;
2. restaure o compose anterior e fixe as imagens na tag `sha-<commit>` anotada no passo 4;
3. `docker compose up -d`.

O backup diário do `bqtech-postgres` (03:15) passa a incluir o `memoriar_db` automaticamente.
