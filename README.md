# Memoriar

MVP composto por três pacotes independentes:

- `frontend/`: Angular 21, servido como arquivos estáticos e consumidor da API same-origin em `/api`;
- `backend/`: Node/Express, com rotas funcionais em `/api` e health check em `/health`;
- `shared/`: pacote TypeScript `@memoriar/shared`, usado pelo frontend e backend via `file:../shared`.

O Supabase continua externo. PostgreSQL e Redis locais não fazem parte desta etapa.

## Desenvolvimento local

Use Node.js 24. O frontend declara a versão do npm em `packageManager`.

```bash
cd shared
npm ci
npm run build

cd ../backend
cp .env.example .env
npm ci
npm run dev

cd ../frontend
npm ci
npm start
```

O Angular encaminha `/api` para `http://localhost:3001` durante o desenvolvimento.
Com `USE_MOCKS=true`, o backend usa os repositórios mock. Com `USE_MOCKS=false`, usa o Supabase e exige as configurações correspondentes.

Variáveis do backend: `PORT`, `FRONTEND_ORIGIN`, `USE_MOCKS`, `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Nunca versione credenciais ou chaves `service-role`; use somente configuração de runtime.

## Validação e build

Cada pacote mantém seu próprio lockfile e usa `npm ci`. O `shared` deve ser compilado antes dos consumidores:

```bash
npm --prefix shared ci
npm --prefix shared run typecheck
npm --prefix shared run build

npm --prefix backend ci
npm --prefix backend run typecheck
npm --prefix backend test
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

Acesse `http://localhost:18083`. Somente o Nginx é publicado em `127.0.0.1`; a API fica na rede interna e recebe `USE_MOCKS=true`. Para encerrar:

```bash
docker compose down
```

## Produção BQTECH (preparada, não implantada)

`compose.production.yaml` referencia `ghcr.io/brenoqn/memoriar-web:latest` e `ghcr.io/brenoqn/memoriar-api:latest`. O Nginx do frontend participa de `bqtech-proxy` e da rede interna `memoriar`; a API participa somente de `memoriar` e não publica porta no host.

Antes de usar o template, forneça em runtime `FRONTEND_ORIGIN`, `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Em produção, `FRONTEND_ORIGIN` deve ser `https://memoriar.bqtech.com.br` e `USE_MOCKS` permanece `false`. Caddy, Cloudflare Tunnel e systemd ficam fora deste repositório nesta etapa.
