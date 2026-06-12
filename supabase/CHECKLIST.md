# Checklist — preparar Supabase (MVP)

## Segurança / premissas

- Frontend não acessa Supabase diretamente.
- Backend usa apenas `SUPABASE_ANON_KEY` e apenas para leitura pública (views).
- Não usar `SUPABASE_SERVICE_ROLE_KEY`.
- Não habilitar escrita admin nesta etapa.

## Ordem exata (SQL)

1. Rodar [initial_mvp_schema.sql](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/supabase/migrations/initial_mvp_schema.sql).
2. Rodar [seed.sql](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/supabase/seed.sql).

## Verificações no Supabase

- Table Editor: confirmar tabelas do domínio (`cemeteries`, `burial_cases`, `deceased_persons`, etc.).
- SQL Editor: confirmar as views públicas:
  - `v_public_deceased_search`
  - `v_public_deceased_detail`
  - `v_public_cemetery_map_nodes`
- SQL Editor: confirmar que a busca retorna “Maria”:
  - `select * from v_public_deceased_search where deceased_name ilike '%maria%';`

## Configuração do backend

1. Criar `backend/.env` a partir de [backend/.env.example](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/backend/.env.example).
2. Para Supabase real:
   - `USE_MOCKS=false`
   - `SUPABASE_URL=...`
   - `SUPABASE_ANON_KEY=...`
3. Para voltar ao mock:
   - `USE_MOCKS=true`

## Testes manuais (backend)

- `GET /api/public/search?q=maria`
- `GET /api/public/cases/99999999-9999-9999-9999-999999999991`
- `GET /api/public/cemeteries/11111111-1111-1111-1111-111111111111/map-nodes`

