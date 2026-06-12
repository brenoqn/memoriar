# Supabase (Memoriar) — setup do MVP (leitura pública)

Este guia prepara o Supabase para o MVP do Memoriar mantendo o backend Node como camada intermediária.

- O frontend Angular continua consumindo o backend Node.
- O frontend não acessa Supabase diretamente.
- Nesta etapa: apenas leitura pública real via views.
- Não usar `SUPABASE_SERVICE_ROLE_KEY` (nem no backend, nem no frontend).

## Pré-requisitos

- Um projeto Supabase já criado.
- Acesso ao painel do Supabase.
- Backend rodando localmente (Node).

## 1) Abrir o SQL Editor no Supabase

1. Acesse o painel do seu projeto Supabase.
2. No menu lateral, abra **SQL Editor**.
3. Clique em **New query**.

## 2) Rodar a migration do schema (obrigatório)

1. Abra o arquivo [initial_mvp_schema.sql](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/supabase/migrations/initial_mvp_schema.sql).
2. Copie todo o conteúdo.
3. Cole no **SQL Editor**.
4. Clique em **Run**.

### Checklist de verificação rápida após rodar o schema

No **Table Editor**, confira se existem as tabelas:
- `cemeteries`, `sectors`, `quadras`, `alleys`
- `map_nodes`, `burial_location_types`, `burial_locations`
- `deceased_persons`, `burial_cases`, `remains_movements`
- `family_responsibles`, `burial_case_family`
- `audit_log`, `app_roles`, `app_users`

No **SQL Editor**, confira se existem as views públicas:
- `v_public_deceased_search`
- `v_public_deceased_detail`
- `v_public_cemetery_map_nodes`

## 3) Rodar o seed (dados mínimos)

1. No **SQL Editor**, clique em **New query**.
2. Abra o arquivo [seed.sql](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/supabase/seed.sql).
3. Copie todo o conteúdo, cole no editor e clique em **Run**.

### IDs fixos criados pelo seed (úteis para testar)

- `cemetery_id`: `a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3`
- `burial_case_id (Maria)`: `1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa`
- `burial_case_id (João)`: `84f0b6e3-4a2f-4d78-9a28-9b5c4d3f42d1`
- `burial_case_id (Ana)`: `9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021`

## 4) Verificar tabelas no Table Editor

1. No menu lateral, abra **Table Editor**.
2. Selecione `deceased_persons` e confirme que existe pelo menos:
   - `Maria Aparecida de Souza`
3. Selecione `burial_cases` e confirme que existem os casos `MEM-0001` a `MEM-0005`.

## 5) Testar as views públicas no SQL Editor

### Buscar “maria”

```sql
select *
from v_public_deceased_search
where deceased_name ilike '%maria%';
```

### Conferir todos os resultados públicos

```sql
select *
from v_public_deceased_search;
```

### Detalhe do caso (Maria)

```sql
select *
from v_public_deceased_detail
where burial_case_id = '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa';
```

### Conferir todos os detalhes públicos

```sql
select *
from v_public_deceased_detail;
```

### Nós do mapa do cemitério

```sql
select *
from v_public_cemetery_map_nodes
where cemetery_id = 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3';
```

### Conferir todos os nós públicos

```sql
select *
from v_public_cemetery_map_nodes;
```

## 6) Queries rápidas de validação do seed

```sql
select * from v_public_deceased_search;
select * from v_public_deceased_search where deceased_name ilike '%maria%';
select * from v_public_deceased_detail;
select * from v_public_cemetery_map_nodes;
```

## 7) Obter SUPABASE_URL e SUPABASE_ANON_KEY

1. No painel do Supabase, abra **Project Settings**.
2. Vá em **API Keys**.
3. Copie:
   - **Project URL** → use como `SUPABASE_URL`
   - **Project API keys** → **anon public** → use como `SUPABASE_ANON_KEY`

## 8) Configurar o backend (Node) para modo Supabase real

No arquivo `backend/.env` (crie a partir de [backend/.env.example](file:///c:/Users/breno/Documents/WorkSpace/Memoriar/backend/.env.example)):

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:4200
USE_MOCKS=false

SUPABASE_URL=coloque_aqui_o_project_url
SUPABASE_ANON_KEY=coloque_aqui_a_anon_public_key
```

Importante:
- Não colocar `SUPABASE_SERVICE_ROLE_KEY` em lugar nenhum.
- `SUPABASE_ANON_KEY` aqui é usada pelo backend para ler views públicas.

## 9) Alternar modos (mock vs Supabase real)

### Modo mock (mantém MVP atual)

```env
USE_MOCKS=true
```

- Não é necessário configurar `SUPABASE_URL`/`SUPABASE_ANON_KEY`.
- O backend continua usando repositórios mockados.

### Modo Supabase real (leitura pública)

```env
USE_MOCKS=false
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

- O backend passa a consultar as views públicas no Supabase.
- O frontend continua chamando o backend.

## 10) Testes manuais (via backend)

Com o backend rodando em `http://localhost:3001`:

- `GET /api/public/search?q=maria`
- `GET /api/public/cases/1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa`
- `GET /api/public/cemeteries/a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3/map-nodes`

Se `USE_MOCKS=false`, essas rotas devem refletir os dados do Supabase.
