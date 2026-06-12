# Admin setup (Supabase)

Este projeto usa Supabase Auth + tabelas `app_users` / `app_roles` para controlar acesso administrativo via RLS. O frontend nunca fala com o Supabase diretamente: o Angular consome apenas o backend Node.

## 1) Criar usuário no Supabase Auth

1. Acesse **Supabase Dashboard → Authentication → Users**
2. Clique em **Add user**
3. Informe email e senha
4. Após criar, copie o **UUID** do usuário (campo `id`)

## 2) Vincular o usuário a um papel (admin)

No **SQL Editor** do Supabase, execute (substitua `__USER_ID__` pelo UUID copiado):

```sql
insert into public.app_users (id, role_id, is_active)
select '__USER_ID__'::uuid, r.id, true
from public.app_roles r
where r.key = 'admin'
on conflict (id) do update
set role_id = excluded.role_id,
    is_active = excluded.is_active,
    updated_at = now();
```

Observações:
- `app_roles.key` deve conter `admin` (o `seed.sql` já cria `admin`, `editor`, `viewer`).
- Sem `app_users` (ou com `is_active=false`) o login até pode retornar token, mas os endpoints admin serão bloqueados por RLS + validação no backend.

## 3) Testar login admin real (backend)

Pré-requisitos (backend):
- `USE_MOCKS=false`
- `SUPABASE_URL` e `SUPABASE_ANON_KEY` configurados no `.env` do backend

Teste com curl:

```bash
curl -s -X POST http://localhost:3001/api/admin/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}'
```

Resposta esperada (`200`):
- `accessToken` (usar como Bearer token)
- `userId`

## 4) Testar endpoints admin (somente leitura)

Com o `accessToken` do login:

```bash
curl -s http://localhost:3001/api/admin/overview \
  -H "authorization: Bearer SEU_ACCESS_TOKEN"
```

Também disponíveis (GET):
- `/api/admin/cemeteries`
- `/api/admin/sectors`
- `/api/admin/quadras`
- `/api/admin/burial-locations`
- `/api/admin/burial-cases`
- `/api/admin/remains-movements`
- `/api/admin/data-quality`

Erros comuns:
- `401 { "error": "missing_token" }`: header Authorization ausente
- `401 { "error": "invalid_token" }`: token inválido/expirado
- `403 { "error": "forbidden" }`: usuário não está ativo em `app_users` ou não tem role `admin`/`editor`

