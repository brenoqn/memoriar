# Implantação BQTECH do Memoriar

Este documento registra o contrato entre o repositório Memoriar e a infraestrutura BQTECH. Não
contém credenciais, endereços internos ou configuração privada do provedor de borda.

## Arquitetura

O Memoriar é entregue como duas imagens que formam um único release lógico:

```text
ghcr.io/brenoqn/memoriar-web
ghcr.io/brenoqn/memoriar-api
```

- `memoriar-web`: frontend Angular estático servido por Nginx;
- `memoriar-api`: API Node/Express sem porta publicada no host;
- `@memoriar/shared`: pacote local compilado antes dos dois consumidores;
- PostgreSQL: container compartilhado `bqtech-postgres` (PostgreSQL 17) na rede `bqtech-data`,
  banco `memoriar_db`, acessado somente pela API;
- `memoriar-migrate`: execução única da imagem da API que aplica as migrations a cada release.

Em produção, `https://memoriar.bqtech.com.br` chega ao frontend pelo proxy reverso. O Nginx
encaminha `/api` e `/health` para a API na rede Docker interna.

## Configuração de runtime

A API usa estas variáveis:

- `PORT`;
- `FRONTEND_ORIGIN`;
- `DATABASE_URL` (de `.secrets/database.env`, apontando para `bqtech-postgres:5432/memoriar_db`);
- `JWT_SECRET` (mínimo de 32 caracteres; assina os tokens administrativos);
- opcionais: `DATABASE_POOL_MAX` (padrão 5) e `JWT_EXPIRES_IN_MINUTES` (padrão 480).

Sem `DATABASE_URL` ou `JWT_SECRET` válidos, a API não inicia e informa qual variável falta.
Valores reais existem somente no runtime privado; nunca os copie para Git ou GitHub Actions.

A autenticação administrativa é própria: usuários em `app_users` com senha em hash scrypt e papéis
`admin`, `editor` e `viewer`. Hoje apenas `admin` e `editor` acessam a área administrativa. O
primeiro usuário é criado com `node dist/db/cli.js create-admin` (ver
[MIGRACAO-POSTGRES.md](MIGRACAO-POSTGRES.md)).

## CI e entrega

Pull requests para `main` validam shared, backend e frontend. Pushes para `main` publicam as duas
imagens com tags `latest` e `sha-<commit-curto>`. O GitHub Actions não acessa o homelab e não
recebe credenciais do servidor ou do banco. Os testes do backend usam um PostgreSQL 17 descartável
criado como service container do próprio workflow. Pull requests também constroem as duas imagens,
sem publicá-las, para que uma falha nos Dockerfiles apareça antes do merge.

O servidor consulta o GHCR por timer e trata web e API como um release conjunto. O procedimento
reportado preserva as duas imagens anteriores, executa health checks e restaura o par anterior
se a atualização falhar. Scripts de update, estado de rollback, proxy, túnel e secrets ficam fora
deste repositório.

## Cache e rotas

- `index.html`: `no-cache, must-revalidate`;
- assets com hash: cache imutável de longa duração;
- demais assets: cache curto;
- rotas Angular: fallback para `index.html`.

Nomes de bundles são gerados pelo build e não podem ser fixados em scripts operacionais.

## Rede

A API participa da rede interna `memoriar` (com o frontend) e da rede externa `bqtech-data` (com o
`bqtech-postgres`). Ela não precisa de saída para a internet. A pendência anterior de egress para o
Supabase deixou de existir com a migração para o banco local.

## Migrations

- Os arquivos ficam em `backend/db/migrations/` (`NNNN_descricao.sql`) e são aplicados em ordem,
  cada um em uma transação, registrados em `schema_migrations`.
- Migrations já publicadas não devem ser editadas; correções entram como um novo arquivo.
- O seed demonstrativo (`backend/db/seeds/demo_seed.sql`) nunca é aplicado automaticamente.

## Fontes de verdade e limites

- O repositório é a fonte de verdade para aplicação, Dockerfiles, Nginx, compose de referência e
  CI.
- O ambiente privado é a fonte de verdade para secrets, imagens efetivamente executadas,
  roteamento, timer, health checks e rollback.
- `compose.production.yaml` documenta a intenção versionada, mas pode divergir do compose
  operacional mantido no servidor; compare os dois antes de qualquer alteração de produção.
- `backend/.env` é configuração local ignorada. Somente `backend/.env.example` pode servir como
  referência versionada, sem valores reais.

## Validação antes de publicar

```bash
npm --prefix shared ci
npm --prefix shared run typecheck
npm --prefix shared run build

npm --prefix backend ci
npm --prefix backend run typecheck
npm --prefix backend test   # precisa do Postgres local (ver README) ou de TEST_DATABASE_URL
npm --prefix backend run build

npm --prefix frontend ci
npm --prefix frontend test -- --watch=false
npm --prefix frontend run build
```

Após a atualização, valide frontend, fallback de rota, `/health`, uma chamada real de `/api` e
logs dos containers. O `/health` responde 200 somente quando a API consegue consultar o banco.
