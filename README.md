# Memoriar

Repositório do MVP do **Memoriar**, composto por:

- `frontend/`: app Angular (consome o backend)
- `backend/`: API Node/Express (pode usar mocks ou ler views públicas do Supabase)
- `shared/`: tipos/contratos compartilhados
- `supabase/`: scripts SQL e guias de setup

## Requisitos

- Node.js (recomendado: versão LTS)

## Como rodar (dev)

### Backend

1. Crie `backend/.env` a partir de `backend/.env.example`
2. Instale e rode:

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Supabase

Veja os guias em `supabase/` (principalmente `supabase/README.md`).

