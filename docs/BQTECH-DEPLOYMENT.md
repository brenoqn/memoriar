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
- Supabase: serviço de dados externo, acessado pela API.

Em produção, `https://memoriar.bqtech.com.br` chega ao frontend pelo proxy reverso. O Nginx
encaminha `/api` e `/health` para a API na rede Docker interna.

## Configuração de runtime

A API usa estas variáveis:

- `PORT`;
- `FRONTEND_ORIGIN`;
- `USE_MOCKS`;
- `SUPABASE_URL`;
- `SUPABASE_ANON_KEY`.

O nome histórico `SUPABASE_ANON_KEY` é parte do contrato atual, mesmo quando o valor configurado
é uma publishable key moderna. Não o renomeie sem uma migração explícita. Valores reais devem
existir somente no runtime privado; não use chaves `service_role` nem copie secrets para Git ou
GitHub Actions.

## CI e entrega

Pull requests para `main` validam shared, backend e frontend. Pushes para `main` publicam as duas
imagens com tags `latest` e `sha-<commit-curto>`. O GitHub Actions não acessa o homelab e não
recebe credenciais do servidor ou do Supabase.

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

## Divergência conhecida de rede

O `compose.production.yaml` versionado conecta a API somente a uma rede marcada como
`internal: true`. Foi reportada latência elevada nas chamadas ao Supabase, enquanto `/health`
responde normalmente. Essa topologia pode impedir ou degradar o egress necessário para o serviço
externo. Além disso, `SupabasePublicSearchRepository` converte erros do Supabase em lista vazia,
o que pode ocultar a falha.

Essa pendência está documentada, mas não deve ser corrigida incidentalmente. Qualquer mudança de
rede ou de tratamento de erro exige uma tarefa dedicada, testes e validação no ambiente privado.

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
npm --prefix backend test
npm --prefix backend run build

npm --prefix frontend ci
npm --prefix frontend test -- --watch=false
npm --prefix frontend run build
```

Após a atualização, valide frontend, fallback de rota, `/health`, uma chamada real de `/api` e
logs dos dois containers. Um health check saudável não confirma, sozinho, conectividade com o
Supabase.
