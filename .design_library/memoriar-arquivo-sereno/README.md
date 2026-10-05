# Memoriar Design System

A design system reconstruction of **Memoriar** — uma plataforma cívica de memória com busca pública respeitosa e operação administrativa orientada por dados.

## Source

- **Figma library:** não informada neste pacote de trabalho
- **Pages:** contagem de páginas e frames não informada neste pacote de trabalho
- **Brand owner:** Memoriar

## What this design system covers

- **Foundations** — cor ancorada em `#2f6c75`, tipografia com **Spectral** e **Inter**, escala espacial de `4px` a `64px`, raios de `8px`, `12px`, `20px` e `9999px`, e cinco níveis de sombra
- **Components** — 10 componentes documentados: Button, Input, Card, Table, TopNav, Sidebar, Badge, Drawer, Modal e LogicalMap
- **Sample kit** — pré-visualizações HTML para a base pública e administrativa, agora também demonstrando overlays, estados semânticos e orientação por mapa lógico com a mesma calma institucional

No panorama conceitual do Memoriar, três direções foram consideradas. **Arquivo Sereno**, a direção implementada, organiza a experiência com precisão pública, acolhimento silencioso e clareza institucional contemporânea. **Jardim de Referência** tenderia a uma presença mais orgânica e acolhedora, útil para uma leitura mais emocional do serviço, enquanto **Editorial de Patrimônio** puxaria o produto para um registro mais documental, sofisticado e institucional. Para este produto, **Arquivo Sereno** é o melhor equilíbrio porque sustenta confiança administrativa sem endurecer a interface e oferece humanidade pública sem cair em sentimentalismo visual.

Na prática, isso significa que a home pública deve parecer um lugar de orientação calma: busca central, hierarquia limpa, textos sóbrios e um uso econômico do azul-petróleo para orientar decisões como “Buscar falecido” e “Ver localização”. Já o dashboard administrativo deve preservar a mesma dignidade, mas com maior densidade operacional: sidebar estável, tabelas legíveis, estados de qualidade de dados claros e superfícies minerais que organizam o volume de informação sem criar sensação de frieza burocrática.

## CONTENT FUNDAMENTALS

### Voice & tone

A voz do Memoriar é humana, respeitosa, serena e organizada, com um grau institucional claro, mas sem burocracia excessiva. O produto não fala como marketing nem como memorialização dramática; ele fala como serviço público contemporâneo que precisa acolher e orientar ao mesmo tempo. O tom evita ornamentação verbal, trabalha com substantivos claros, verbos diretos e contextos funcionais, e privilegia rótulos objetivos sobre frases promocionais. Em português, isso se traduz em chamadas como “Buscar falecido” e “Ver localização”, que são curtas, explícitas e emocionalmente controladas. Não há sinais de linguagem expansiva, humor, interjeições ou emojis; a elegância vem da contenção.

### Concrete copy examples

- **Busca pública:** *“Buscar falecido”*
- **Ação contextual:** *“Ver localização”*
- **Painel operacional:** *“Qualidade dos dados”*
- **Listagem administrativa:** *“Casos funerários”*
- **Rastreamento de fluxo:** *“Movimentações”*

### When generating copy

- Prefira rótulos curtos, descritivos e orientados à tarefa, no padrão de “Buscar falecido” e “Ver localização”.
- Dê nome direto às áreas do sistema; “Qualidade dos dados”, “Casos funerários” e “Movimentações” mostram que a nomenclatura deve ser explícita, não conceitual.
- Mantenha a linguagem respeitosa e neutra; o produto pede acolhimento silencioso, não persuasão emocional.
- Em interfaces públicas, escreva para orientar com clareza; em interfaces administrativas, escreva para reduzir ambiguidade operacional.

## 3. Visual Foundations

### Color

A paleta parte de um eixo primário azul-petróleo em `#2f6c75` (`--memoriar-petroleo-600`), com progressão de 10 paradas entre `#eef6f6` e `#102a30`. Esse intervalo permite que o Memoriar trabalhe confiança institucional sem recorrer a um azul tecnológico frio demais ou a um verde terapêutico excessivo. O uso esperado do primário aparece em ações, realces e superfícies de apoio, com `--primary` ligado ao próprio `#2f6c75`, `--accent` em `#4d858d` e `--link` em `#24555d`. O efeito geral é de decisão calma: há contraste suficiente para orientar, mas não para dramatizar.

Os neutros também são estruturais para a direção Arquivo Sereno. A escala de areia percorre 10 paradas entre `#fcfaf6` e `#252320`, com `--bg` em `#fcfaf6`, `--surface` em `#f6f1ea` e `--surface-container-high` em `#ddd3c3`. Em vez de um branco clínico, o sistema trabalha com superfícies minerais quentes, úteis para um produto que lida com memória, registros e consulta pública. Esse fundo faz com que o azul-petróleo pareça cívico e contido, não corporativo.

As cores semânticas mantêm o mesmo raciocínio. Sucesso ancora em `#4d8250`, warning em `#b06f22`, erro em `#a04538` e info em `#2f6ca6`. Nenhuma delas busca alarme visual máximo; a função aqui é informar com dignidade. No dashboard, isso é especialmente importante para estados como qualidade de dados, pendências e revisão. Na área pública, a prioridade é não transformar informação sensível em sinalização agressiva.

O modo escuro existe como extensão funcional do sistema, com `--bg` em `#161a1c`, `--surface` em `#1d2326` e primário em `#6fabb0`. Ele preserva a lógica cromática do arquivo sereno, mas deve ser entendido como uma continuidade operacional, não como a face principal da marca. A vibração visual do Memoriar, portanto, vem da combinação entre petróleo, areia e semânticos contidos: um vocabulário de confiança pública, calma editorial e acolhimento adulto.

### Typography

A tipografia assume uma divisão clara de papéis. **Spectral** é a família de display e heading, declarada em `--font-display` e `--font-heading`, com pesos `500`, `600` e `700` importados no arquivo. Ela introduz uma gravidade editorial que ajuda o produto a lidar com memória e patrimônio sem parecer antiquado. **Inter** é a família de corpo, declarada em `--font-body`, com pesos `400`, `500`, `600` e `700`, e serve à leitura cotidiana, à rotulagem de interface e à estabilidade operacional das telas administrativas.

Na escala tipográfica, o sistema trabalha com display de `52px` a `1.08`, `h1` de `40px` a `1.2`, `h2` de `32px` a `1.25`, `h3` de `24px` a `1.3`, `h4` de `20px` a `1.35`, body de `16px` a `1.6`, lead de `18px` a `1.65`, caption de `12px` a `1.45` e mono de `14px` a `1.5`. Essa combinação sugere uma hierarquia generosa para a camada pública e suficientemente racional para a administrativa. O display ainda recebe `letter-spacing: -0.02em`, reforçando presença editorial sem perder refinamento.

Para números, códigos e casos em que alinhamento técnico importa, o sistema declara `ui-monospace`, `SFMono-Regular`, `Consolas` e `monospace` em `--font-mono`. Isso posiciona a tipografia monoespaçada como ferramenta de suporte, não como linguagem dominante. O conjunto todo evita o padrão “sans universal” e cria uma alternância importante: títulos com densidade cultural, corpo com neutralidade operacional.

### Spacing

O espaço-base é `4px`, distribuído nos tokens `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px` e `64px`. Essa sequência sustenta bem a dupla natureza do produto: a área pública pode respirar usando `24px`, `32px` e `48px` para criar pausa e clareza, enquanto o ambiente administrativo consegue comprimir a densidade com `8px`, `12px` e `16px` sem perder organização. Em componentes, a escala se manifesta de modo direto nos controles: botões pequenos em `32px`, botões médios em `40px`, inputs em `44px`, botões grandes em `48px`, topnav em `72px` e sidebar em `280px` de largura. O resultado é um sistema que trabalha com ritmo previsível e leitura estável, não com gesto expressivo.

### Radius

- **`8px`** é o raio menor do sistema e funciona bem para controles e enquadramentos discretos, preservando suavidade sem parecer lúdico.
- **`12px`** é o raio intermediário e tende a ser o melhor ponto para superfícies de interface que pedem acolhimento mais visível, como cartões e contêineres secundários.
- **`20px`** é o raio mais aberto para superfícies que devem parecer mais macias ou destacadas, sem virar cápsulas informais.
- **`9999px`** é reservado para soluções plenamente arredondadas, quando a interface precisar de chips, pílulas ou marcadores de estado integralmente curvos.

### Shadow / Elevation

O sistema tem cinco níveis de sombra, todos discretos e baseados no mesmo pigmento escuro `rgba(16,42,48,...)`, o que mantém coerência com o eixo petróleo do restante da biblioteca. A primeira camada, `--shadow-1`, usa `0 1px 2px 0 rgba(16,42,48,0.08), 0 1px 1px 0 rgba(16,42,48,0.04)` e é adequada para linhas de dados e apoios mínimos. A segunda, `--shadow-2`, sobe para `0 4px 12px -4px rgba(16,42,48,0.10), 0 2px 4px 0 rgba(16,42,48,0.05)` e já entrega presença suficiente para cards. Os níveis seguintes servem a drawer, modal e overlay, culminando em `--shadow-5` com `0 28px 60px -18px rgba(16,42,48,0.26), 0 10px 22px 0 rgba(16,42,48,0.10)`. A filosofia não é fazer os elementos flutuarem; é apenas separar camadas com o mínimo de ruído.

### Borders

- As bordas trabalham com `--border` em `#ddd3c3`, `--outline` em `#c5b7a3` e `--outline-variant` em `#ebe4d8`, o que reforça o caráter mineral e silencioso do sistema.
- Em vez de grandes massas de contraste, o desenho confia em filetes quentes e claros para organizar componentes como inputs, tabelas e a navegação administrativa.
- O comportamento de foco desloca a ênfase para o anel em `--ring`, ligado a `#6ea0a6`, preservando legibilidade sem endurecer o contorno.

### Backgrounds

- O fundo principal em `#fcfaf6` evita neutralidade hospitalar e aproxima o sistema de um papel editorial contemporâneo.
- Superfícies secundárias em `#f6f1ea`, `#ebe4d8` e `#ddd3c3` ajudam a construir hierarquia por temperatura e profundidade leve, não por blocos pesados.
- No dashboard, isso permite densidade com serenidade; na home pública, ajuda a fazer a busca parecer orientação e não triagem burocrática.

## 4. Component Patterns

| Component | Preview | Contract | CSS Source | Key Facts | Key Insight |
|---|---|---|---|---|---|
| Button | `preview/component-button.html` | `components/button.json` | `components.css` | Alturas de `32px`, `40px` e `48px`, com hierarquia primary, secondary e ghost. | O botão principal usa o petróleo `#2f6c75` para decisões serenas; os demais aliviam a interface sem perder autoridade cívica. |
| Input | `preview/component-input.html` | `components/input.json` | `components.css` | Campo de `44px`, com estados de foco e apoio para busca, filtro e credencial. | Inputs de borda quieta reduzem atrito emocional na consulta pública e estabilizam tarefas administrativas. |
| Card | `preview/component-card.html` | `components/card.json` | `components.css` | Superfícies com hierarquia leve, títulos editoriais e áreas de meta-informação. | O card funciona como placa informativa: acolhe conteúdo sensível sem dramatizar a moldura. |
| Table | `preview/component-table.html` | `components/table.json` | `components.css` | Estrutura densa com cabeçalho, linhas operacionais e leitura de estados sem excesso visual. | A tabela traduz clareza administrativa em ritmo legível, sem cair na frieza de grade corporativa genérica. |
| TopNav | `preview/component-topnav.html` | `components/topnav.json` | `components.css` | Barra pública com marca, navegação e busca central como eixo primário de orientação. | A topnav parece serviço e orientação, não cabeçalho promocional, preservando a calma editorial da marca. |
| Sidebar | `preview/component-sidebar.html` | `components/sidebar.json` | `components.css` | Navegação lateral estável, seções agrupadas e item ativo discreto para trabalho contínuo. | A sidebar organiza o volume operacional sem recorrer ao bloco escuro típico de dashboards genéricos. |
| Badge | `preview/component-badge.html` | `components/badge.json` | `components.css` | Tons semânticos info, success, warning e error em estilos soft e outlined. | O badge sinaliza publicação e qualidade de dados com delicadeza institucional, sem transformar status em alarme. |
| Drawer | `preview/component-drawer.html` | `components/drawer.json` | `components.css` | Layouts public-detail e admin-edit com hierarquia respirável para leitura lateral. | O drawer cria um painel de detalhe para informação sensível sem romper o contexto principal da tarefa. |
| Modal | `preview/component-modal.html` | `components/modal.json` | `components.css` | Padrões de confirmação neutra e revisão com warning, ambos centrados em decisão clara. | O modal confirma ações institucionais com gravidade calma, evitando tom alarmista mesmo em revisões críticas. |
| LogicalMap | `preview/component-logical-map.html` | `components/logical-map.json` | `components.css` | Estados de orientação pública e estrutura administrativa com nó selecionado em destaque. | O mapa lógico orienta espacialmente com serenidade editorial, mais wayfinding do que peso técnico de GIS. |

## 5. Index

- `README.md` — narrativa de marca e fundamentos do sistema
- `SKILL.md` — resumo operacional para agentes e equipes que precisem ativar rapidamente a biblioteca
- `colors_and_type.css` — tokens de cor, tipografia, espaçamento, radius e sombra em CSS
- `css.json` — representação estruturada dos tokens para consumo programático
- `components.css` — CSS agregado dos componentes a partir das pré-visualizações
- `components/index.json` — índice de componentes e padrões transversais da biblioteca
- `components/*.json` — contratos compactos de Button, Input, Card, Table, TopNav, Sidebar, Badge, Drawer, Modal e LogicalMap
- `preview/` — cartões HTML de referência visual para os 10 componentes documentados, incluindo overlays, estados semânticos e orientação por mapa lógico
- `library-consumption.json` — ordem recomendada de leitura para uso downstream

## 6. Caveats / known substitutions

1. **Fonte original do pacote**: este pacote não informa nome de biblioteca Figma nem contagem de páginas; por isso o README registra a reconstrução como documentação operacional do sistema atual, não como espelho auditável de um arquivo-fonte.
2. **Importação tipográfica**: `colors_and_type.css` importa **Spectral** e **Inter** via Google Fonts. Em ambientes sem carregamento externo, a hierarquia ainda existe, mas a renderização pode cair para `serif` e `sans-serif`, alterando levemente o tom editorial.
3. **Monoespaçada**: para contextos técnicos, o sistema já prevê a substituição progressiva por `ui-monospace`, `SFMono-Regular`, `Consolas` e `monospace`; isso é útil para dados, ids e referências internas.
4. **Origem dos componentes**: os componentes foram inferidos a partir do briefing textual do produto e servem como base inicial para expansão posterior do sistema. Eles são adequados como direção e contrato inicial, mas não devem ser lidos como inventário final de produto.
5. **Origem dos tokens**: o CSS traz muitos comentários marcados como “AI-generated”. Neste README, todos os valores foram copiados do arquivo como fonte operacional vigente, mas a procedência desses escalonamentos deve ser tratada como síntese de sistema, não como evidência histórica.
