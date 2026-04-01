# 📋 Tracker Semanal — Calendário Estratégico

Aplicativo de rastreamento semanal de atividades construído em React, projetado para empreendedores que gerenciam múltiplas frentes de trabalho simultaneamente.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Style-Inline_CSS-blue)
![Storage](https://img.shields.io/badge/Storage-Persistent_KV-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Sobre

O Tracker Semanal nasceu da necessidade de organizar a rotina de quem opera múltiplos projetos — criação de conteúdo, e-commerce, reuniões, estudo e produção — sem perder visibilidade do que foi feito, do que ficou pendente e de quanto tempo cada atividade realmente consumiu.

Diferente de um to-do list genérico, o tracker é estruturado em blocos de tempo fixos por dia da semana, com a flexibilidade de reorganizar blocos via drag & drop quando a semana não sai como planejado.

---

## Funcionalidades

### 📅 Visão Semanal (Drag & Drop)
- Grid de 5 colunas (segunda a sexta) com todos os blocos visíveis
- Arraste e solte atividades entre dias para reorganizar a semana
- Layout customizado salva automaticamente por semana
- Indicador visual do dia atual

### 📝 Visão por Dia
- Cards detalhados com checkbox, notas rápidas e tempo real
- Filtro por dia ou visualização completa
- Descrição de cada atividade com contexto de execução
- Automações sugeridas por bloco (expansível)

### 📊 Resumo Semanal
- Percentual de conclusão por categoria e por dia
- Gráfico de barras por dia da semana
- Comparativo de tempo planejado vs. tempo real
- Compilado de todas as notas da semana

### ⚡ Automações
- Sugestões de automação para cada bloco usando n8n, Apify e Claude
- Organizadas por dia para fácil referência
- Descrição prática do que cada automação faz

### Outras funcionalidades
- **Persistência entre sessões** — dados salvos em storage local por semana
- **Navegação entre semanas** — avance ou volte semanas, cada uma com dados independentes
- **Registro de tempo real** — compare quanto planejou vs. quanto realmente gastou
- **Notas rápidas** — adicione contexto a qualquer bloco (ex: "ficou pra amanhã", "esperando aprovação")
- **Reset semanal** — limpe dados e layout de qualquer semana

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 18+ | UI com hooks (useState, useEffect, useCallback) |
| CSS inline | Estilização sem dependências externas |
| Inter (Google Fonts) | Tipografia |
| Persistent KV Storage | Dados entre sessões (via `window.storage`) |
| HTML5 Drag and Drop API | Reorganização de blocos na visão semanal |

---

## Estrutura do Projeto

```
tracker-semanal/
├── src/
│   └── App.jsx          # Componente principal (single-file)
├── public/
│   └── index.html       # HTML base
├── package.json
└── README.md
```

O app é um **single-file component** — toda a lógica, dados, estilização e layout vivem em `App.jsx`. Isso é intencional: facilita iteração rápida e deploy em plataformas como Claude Artifacts, Vercel ou qualquer ambiente React.

---

## Instalação e Uso

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tracker-semanal.git
cd tracker-semanal

# Instale dependências
npm install

# Rode em desenvolvimento
npm run dev
```

### Deploy

O projeto é compatível com qualquer plataforma que suporte React:

```bash
# Build para produção
npm run build

# Preview local do build
npm run preview
```

---

## Configuração

### Alterando o calendário padrão

O objeto `DEFAULT_SCHEDULE` no início de `App.jsx` define a estrutura semanal. Cada bloco segue o formato:

```javascript
{
  id: "seg-1",           // Identificador único
  time: "8h–9h",         // Horário exibido
  task: "Nome da tarefa", // Título do bloco
  icon: "☕",             // Emoji do bloco
  cat: "admin",          // Categoria (define cor da borda)
  desc: "Descrição...",  // Detalhes da atividade
  auto: "Automação...",  // Sugestão de automação (opcional)
  mins: 60               // Duração planejada em minutos
}
```

### Categorias disponíveis

| Categoria | Cor | Uso |
|---|---|---|
| `ia` | Roxo | Criação de conteúdo IA |
| `va` | Âmbar | Criação de conteúdo Vida Autoral |
| `pesquisa` | Ciano | Pesquisa e exploração |
| `estudo` | Roxo escuro | Estudo e desenvolvimento de curso |
| `ecom` | Amarelo | Operação de e-commerce |
| `social` | Laranja | Engajamento em redes sociais |
| `reuniao` | Verde | Reuniões e alinhamentos |
| `admin` | Cinza | Tarefas administrativas |
| `saude` | Verde claro | Saúde e exercício |
| `revisao` | Azul | Revisão e planejamento |

### Storage

O app usa duas chaves por semana:

- `tracker-v3:data:YYYY-MM-DD` — status das atividades (check, notas, tempo real)
- `tracker-v3:sched:YYYY-MM-DD` — layout da semana (ordem dos blocos por dia)

A data na chave corresponde à segunda-feira daquela semana.

---

## Adaptando para seu uso

Este tracker foi construído para um contexto específico (empreendedora gerenciando conteúdo, e-commerce e estudo), mas a estrutura é genérica. Para adaptar:

1. **Edite `DEFAULT_SCHEDULE`** com seus blocos e horários
2. **Ajuste `catColors` e `catLabels`** para suas categorias
3. **Modifique `DAYS`** se precisar incluir fins de semana
4. **Remova os campos `auto`** se não usar automações

---

## Storage: adaptação para outros ambientes

O app utiliza `window.storage` (API de KV storage persistente disponível em Claude Artifacts). Para rodar em outros ambientes, substitua as chamadas por `localStorage`:

```javascript
// Substitua window.storage.get(key) por:
const get = (key) => {
  const val = localStorage.getItem(key);
  return val ? { value: val } : null;
};

// Substitua window.storage.set(key, value) por:
const set = (key, value) => {
  localStorage.setItem(key, value);
  return { key, value };
};

// Substitua window.storage.delete(key) por:
const del = (key) => {
  localStorage.removeItem(key);
  return { key, deleted: true };
};
```

---

## Licença

MIT — use, modifique e distribua livremente.

---

Feito com ☕ e Claude.
