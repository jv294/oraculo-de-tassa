# Oráculo de Tassa

> Um agente de IA para Magic: The Gathering — digite um efeito desejado em linguagem natural e receba recomendações de cartas e combos, powered by OpenRouter & Scryfall.

---

## 🎯 Visão do Projeto

O **Oráculo de Tassa** é uma interface web imersiva e temática inspirada na deusa Thassa de *Theros*, no universo de *Magic: The Gathering*. O usuário descreve um efeito (ex: *"carta azul que compra duas"*, *"combo de mana infinita"*) e a IA traduz essa descrição em uma query estruturada para a API do Scryfall, retornando cartas relevantes com imagens e informações de preço via LigaMagic.

### Funcionalidades

- 🔮 **Busca em Linguagem Natural** — traduza descrições casuais em queries avançadas do Scryfall
- 🤖 **IA como Tradutor** — OpenRouter (modelos gratuitos) interpreta a intenção e gera a sintaxe correta
- 🖼️ **Grid Responsivo de Cards** — arte das cartas em alta com hover interativo e link para LigaMagic
- 🌊 **UI Temática Imersiva** — fundo de Nyx, constelações, gradientes abissais e animação de loading mística
- 📱 **Mobile-First** — cards em par, barra de busca adaptativa, header colapsável
- 🔄 **Resiliência** — retry automático, graceful fallback em caso de falhas na API externa

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Estilização** | Tailwind CSS (custom theme `thassa-*` + `amber-*`) |
| **Backend** | Route Handlers (Next.js API Routes) — serverless |
| **IA / LLM** | OpenRouter API (`openrouter/auto`) — modelo gratuito auto-selecionado |
| **Dados MTG** | [Scryfall API](https://scryfall.com/) — busca de cartas |
| **Preços** | [LigaMagic](https://www.ligamagic.com.br/) — redirecionamento de cards |
| **Fonts** | Google Fonts (Playfair Display + Inter) |

---

## 🚀 Como Rodar

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
│   ├── MtgCard.tsx               # Card de carta com hover, link LigaMagic, IntersectionObserver
│   ├── SearchBar.tsx              # Input + botão + loading místico
│   └── SearchResults.tsx         # Grid de resultados + empty state
├── lib/
│   └── ligamagic.ts               # buildLigaMagicUrl()
├── services/
│   ├── openrouter.ts              # processPromptWithOpenRouter() — tradução IA
│   └── scryfall.ts               # searchScryfallByQuery() — busca de cartas
├── types/
│   └── index.ts                  # ScryfallCard, SearchResult, OracleResponse
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts            # Custom theme: thassa-*, amber-*, animações
└── tsconfig.json
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
OpenRouter (system prompt: tradutor Scryfall)
        │  (traduz "carta azul que compra 2" → c:u o:"draw two cards")
        ▼
Scryfall API  GET /cards/search?q=c:u+o:"draw+two+cards"
        │
        ▼
{ query: string, data: Card[], error: boolean }
        │
        ▼
Frontend renderiza grid de cards ou Empty State
```

---

## 📜 Licença

Este projeto é um exercício de desenvolvimento e não possui vínculo com Wizards of the Coast, Scryfall ou qualquer outra entidade oficial de Magic: The Gathering.

---

*Feito com 💧 profundezas abissais e ☀️ luz de Nyx.*
