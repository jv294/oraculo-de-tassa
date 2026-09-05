# Oráculo de Tassa

> Um agente de IA para Magic: The Gathering — digite um efeito desejado (mecânico ou temático) e receba recomendações de cartas e combos, powered by OpenRouter & Scryfall.

---

## 🎯 Visão do Projeto

O **Oráculo de Tassa** é uma interface web imersiva e temática inspirada na deusa Thassa de *theros*, no universo de *Magic: The Gathering*. O usuário descreve um efeito (ex: *"carta azul que compra duas"*, *"combo de mana infinita"*, *"deck de kaiju"*) e a IA traduz essa descrição em uma query estruturada para a API do Scryfall, retornando cartas relevantes com imagens e link para preços em R$ na LigaMagic.

### Funcionalidades

- 🔮 **Busca em Linguagem Natural** — traduza descrições casuais em queries avançadas do Scryfall
- 🤖 **IA Contextual como Tradutor** — OpenRouter (modelos gratuitos) interpreta intenções mecânicas e **também temas criativos** (kaiju, steampunk, gatos, oceano) via tags `art:`, `lore:`, `flavor:`
- 🖼️ **Grid Responsivo com Infinite Scroll** — arte das cartas em alta com IntersectionObserver, blocos de 10 a cada scroll
- 🌊 **UI Temática Imersiva** — fundo de Nyx, constelações douradas, gradientes abissais e animação de loading mística
- 📱 **Mobile-First** — cards em par, barra de busca adaptativa, header colapsável
- 🔄 **Resiliência** — retry automático (2x) para falhas da OpenRouter, sempre retorna HTTP 200 graceful
- ⚡ **Performance** — backend envia lista completa (até 175 cartas) em 1 request; frontend renderiza sob demanda

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Estilização** | Tailwind CSS (custom theme `thassa-*` + `amber-*`) |
| **Backend** | Route Handlers (Next.js API Routes) — serverless |
| **IA / LLM** | OpenRouter API (`openrouter/auto`) — modelo gratuito auto-selecionado |
| **Dados MTG** | [Scryfall API](https://scryfall.com/) — busca com suporte a tags visuais (`art:`, `lore:`) |
| **Preços** | [LigaMagic](https://www.ligamagic.com.br/) — redirecionamento de cards |
| **Fonts** | Google Fonts (Playfair Display + Inter) |
| **Deploy** | [Vercel](https://vercel.com/) — zero-config Next.js |

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos

- Node.js 18+ e npm

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o exemplo e preencha sua chave da OpenRouter:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-sua-chave-aqui
# O modelo é opcional — o padrão é "openrouter/auto"
# OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

> ⚠️ **Nota:** O modelo padrão `openrouter/auto` seleciona automaticamente o melhor modelo gratuito disponível na sua conta. Você também pode especificar um modelo específico como `google/gemini-2.5-flash-free` ou `mistralai/mistral-7b-instruct:free`.

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
oraculo-de-tassa/
├── app/
│   ├── api/
│   │   ├── oracle/
│   │   │   └── route.ts          # POST /api/oracle — orquestra OpenRouter → Scryfall
│   │   └── price/
│   │       └── route.ts           # GET /api/price — esqueleto de scraping (opcional)
│   ├── globals.css                # Reset + tema global
│   ├── layout.tsx                 # Root layout com fontes + metadata
│   └── page.tsx                   # Página principal (cliente)
├── components/
│   ├── MtgCard.tsx               # Card de carta com hover, link LigaMagic
│   ├── SearchBar.tsx             # Input + botão + loading místico
│   └── SearchResults.tsx         # Grid com infinite scroll (10/vez) + empty state
├── lib/
│   └── ligamagic.ts              # buildLigaMagicUrl()
├── services/
│   ├── openrouter.ts             # processPromptWithOpenRouter() — tradução IA contextual
│   └── scryfall.ts              # searchScryfallByQuery() — busca de cartas
├── types/
│   └── index.ts                 # ScryfallCard, SearchResult, OracleResponse
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts            # Custom theme: thassa-*, amber-*, animações
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `thassa-900` | `#0a0e1a` | Fundo principal |
| `thassa-700` | `#1a2332` | Bordas e contêineres |
| `thassa-400` | `#3b4f6e` | Texto secundário |
| `amber-500` | `#f59e0b` | Acentos, botões, destaques |
| `amber-400` | `#fbbf24` | Glows e hover states |

### Tema Visual

- **Background**: Imagem de arte de Island (Theros Beyond Death) com overlays escuros + ruído de papel
- **Constelações de Nyx**: Padrão SVG de estrelas douradas/azuis
- **Cards**: Cantos arredondados, imagem com zoom suave no hover, overlay dourado "Ver no LigaMagic"
- **Loading**: Orbe dourado flutuante com halos, partículas e brilho interno

---

## 🔑 Fluxo de Dados

```
Usuário digita efeito
        │
        ▼
POST /api/oracle  { prompt: "..." }
        │
        ▼
OpenRouter (system prompt: tradutor contextual Scryfall)
        │  (traduz "deck de kaiju" → art:kaiju OR t:dinosaur OR t:leviathan)
        ▼
Scryfall API  GET /cards/search?q=art:kaiju+OR+t:dinosaur
        │  (retorna até 175 cartas)
        ▼
{ query: string, data: Card[], error: boolean }
        │
        ▼
Frontend: renderiza 20 cards iniciais (slice 0-20)
        │
        ▼
Scroll: IntersectionObserver dispara +10 cards a cada vez
```

---

## 🧠 System Prompt (Lógica do Oráculo)

O `services/openrouter.ts` contém um System Prompt rigoroso que instrui a IA a:

1. **Não ser conversacional** — retorna APENAS a string de query
2. **Traduzir mecânica** (ex: "carta que compra" → `o:"draw a card"`)
3. **Interpretar temas criativos** (ex: "kaiju" → `art:kaiju OR t:dinosaur`)
4. **Usar Few-Shot Learning** — exemplos concretos no prompt guiam o modelo

### Operadores Scryfall Suportados

- **Mecânica**: `o:"texto"`, `keyword:mutate`, `t:instant`, `t:creature`
- **Cor**: `c:w`, `c:u`, `ci:ur` (Commander)
- **Valores**: `mv=3`, `pow>=6`, `tou<4`
- **Metadados**: `f:commander`, `is:split`
- **Art (Tagger visual)**: `art:kaiju`, `art:cat`, `art:fire`
- **Lore/Flavor**: `lore:"kaiju"`, `flavor:"blood"`

---

## 🐛 Tratamento de Erros

| Cenário | Tratamento |
|---------|------------|
| OpenRouter retorna `content: null` | Retry automático (2x) com log de warning |
| OpenRouter 5xx ou rate limit | Retry automático com backoff |
| OpenRouter falhar após 2 tentativas | API retorna HTTP 200 com `{ error: true, explanation: "..." }` |
| Scryfall 404 (sem cartas) | `data: []` + empty state temático |
| Scryfall 400 (sintaxe inválida) | `data: []` + empty state |
| Frontend recebe HTML de erro | Tenta parsear JSON, fallback para mensagem genérica |

---

## 📜 Licença

Este projeto é um exercício de desenvolvimento e não possui vínculo com Wizards of the Coast, Scryfall ou qualquer outra entidade oficial de Magic: The Gathering.

---

*Feito com 💧 profundezas abissais e ☀️ luz de Nyx.*
