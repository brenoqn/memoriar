# Memoriar

MVP composto por três pacotes independentes:

- `frontend/`: Angular 21, servido como arquivos estáticos e consumidor da API same-origin em `/api`;
- `backend/`: Node/Express, com rotas funcionais em `/api` e health check em `/health`;
- `shared/`: pacote TypeScript `@memoriar/shared`, usado pelo frontend e backend via `file:../shared`.

Os dados ficam em PostgreSQL 17: em produção, no container `bqtech-postgres` da BQTECH; no
desenvolvimento, no serviço `memoriar-db` do `compose.yaml`. A API é a única que acessa o banco, e a
autenticação administrativa é própria (usuários em `app_users`, senhas com hash scrypt, tokens JWT).

## Desenvolvimento local

Use Node.js 24. O frontend declara a versão do npm em `packageManager`.

```bash
# 1. Banco local (Postgres 17 em 127.0.0.1:5432, já com o banco de testes memoriar_test)
docker compose up -d memoriar-db

# 2. Pacote compartilhado
cd shared
npm ci
npm run build

# 3. Backend
cd ../backend
cp .env.example .env          # ajuste JWT_SECRET
npm ci
npm run db:migrate            # cria o schema
npm run db:seed               # DADOS DEMONSTRATIVOS (opcional)
npm run dev

# 4. Frontend
cd ../frontend
npm ci
npm start
```

O Angular encaminha `/api` para `http://localhost:3001` durante o desenvolvimento.

Para entrar na área administrativa, crie um usuário. A senha (mínimo de 12 caracteres) é lida da
entrada padrão, para não ficar no histórico do shell:

```bash
cd backend
read -rsp 'Senha: ' PW; echo
printf '%s\n' "$PW" | ADMIN_EMAIL=voce@exemplo.com.br npm run db:create-admin
unset PW
```

Variáveis do backend: `PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL`, `JWT_SECRET` e, opcionalmente,
`DATABASE_POOL_MAX` e `JWT_EXPIRES_IN_MINUTES`. Nunca versione credenciais; use somente
configuração de runtime.

### Banco de dados

- **Migrations:** `backend/db/migrations/NNNN_descricao.sql`, aplicadas em ordem por
  `npm run db:migrate` (ou `node dist/db/cli.js migrate` na imagem). Não edite uma migration já
  publicada; correções entram como um arquivo novo.
- **Seed demonstrativo:** `backend/db/seeds/demo_seed.sql`. Os registros são fictícios, e o cemitério
  é identificado como "(demonstração)".
- **Testes do backend:** rodam contra um banco real e **apagam o schema** do banco de testes. Por
  padrão usam o `memoriar_test` do Postgres local. Para outro banco, defina `TEST_DATABASE_URL`; o
  nome do banco precisa terminar em `_test`.

## Validação e build

Cada pacote mantém seu próprio lockfile e usa `npm ci`. O `shared` deve ser compilado antes dos consumidores:

```bash
npm --prefix shared ci
npm --prefix shared run typecheck
npm --prefix shared run build

npm --prefix backend ci
npm --prefix backend run typecheck
npm --prefix backend test       # precisa do Postgres local ou de TEST_DATABASE_URL
npm --prefix backend run build

npm --prefix frontend ci
npm --prefix frontend test -- --watch=false
npm --prefix frontend run build
```

Os Dockerfiles usam a raiz do repositório como contexto. Eles copiam e compilam `shared/` antes de executar `npm ci` no consumidor, de modo que `file:../shared` continue resolvendo sem converter o repositório em workspace.

## Docker local

```bash
docker compose up --build -d
```

Acesse `http://localhost:18083`. O serviço `memoriar-migrate` aplica as migrations e o seed
demonstrativo antes de a API subir. O Nginx e o Postgres são publicados somente em `127.0.0.1`; a API
fica na rede interna. Para criar um usuário administrativo:

```bash
read -rsp 'Senha: ' PW; echo
printf '%s\n' "$PW" | docker compose run --rm -T -e ADMIN_EMAIL=voce@exemplo.com.br \
  memoriar-migrate node dist/db/cli.js create-admin
unset PW
```

Para encerrar:

```bash
docker compose down
```

## Produção BQTECH

`compose.production.yaml` referencia `ghcr.io/brenoqn/memoriar-web:latest` e `ghcr.io/brenoqn/memoriar-api:latest`. O Nginx do frontend participa de `bqtech-proxy` e da rede interna `memoriar`; a API participa de `memoriar` e de `bqtech-data` (onde está o `bqtech-postgres`) e não publica porta no host. A cada release, `memoriar-migrate` aplica as migrations pendentes antes de a API subir.

Forneça em runtime `FRONTEND_ORIGIN`, `DATABASE_URL` e `JWT_SECRET`. Em produção, `FRONTEND_ORIGIN` deve ser `https://memoriar.bqtech.com.br`.
Caddy, Cloudflare Tunnel, secrets e automação systemd ficam fora deste repositório.

O contrato de implantação está em [docs/BQTECH-DEPLOYMENT.md](docs/BQTECH-DEPLOYMENT.md), e o roteiro
de virada do Supabase para o Postgres local, em [docs/MIGRACAO-POSTGRES.md](docs/MIGRACAO-POSTGRES.md).
