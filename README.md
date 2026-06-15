# Partidas de Futebol — Front-end

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Projeto de estudos desenvolvido com React e Vite para praticar a construção de uma SPA que consome uma API REST. A interface permite gerenciar clubes, estádios e partidas de futebol, além de visualizar rankings e retrospectos.

> Objetivo principal: consolidar conceitos de front-end com React — gerenciamento de estado, consumo de API com autenticação JWT, componentização e navegação por abas.

---

## Back-end (API)

Este projeto depende da API REST disponível em:

**[silvio-tav/it-neocamp-partidas-futebol-api](https://github.com/silvio-tav/it-neocamp-partidas-futebol-api)**

A API é desenvolvida com Java e Spring Boot e expõe os endpoints de clubes, estádios, partidas, ranking e retrospecto que este front-end consome. Consulte o README do repositório da API para instruções de como executá-la localmente.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Autenticação](#autenticação)

---

## Funcionalidades

- **Login** com autenticação JWT (token armazenado no `localStorage`)
- **Partidas** — listagem, cadastro, edição, remoção e filtros por clube, estádio e goleada
- **Clubes** — listagem, cadastro, edição, inativação e filtros por nome e estado
- **Estádios** — listagem, cadastro, edição, remoção e filtro por nome
- **Ranking** — ordenável por pontos, gols, vitórias ou jogos
- **Retrospecto** — desempenho de um clube por atuação (geral / mandante / visitante) e confronto direto contra adversários
- Métricas resumidas no topo da página (clubes ativos, estádios, partidas e posições no ranking)
- Tratamento de sessão expirada (401 → logout automático)

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 8 | Bundler e dev server |
| JavaScript (ES Modules) | ES2024 | Linguagem principal |
| Fetch API | — | Comunicação HTTP com a API |
| localStorage | — | Persistência do token JWT |
| ESLint | 10 | Linting |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/        # AppHeader, LoginPage, TabNavigation, Notice, SummaryMetrics
│   └── tabs/          # PartidasTab, ClubesTab, EstadiosTab, RankingTab, RetrospectoTab
├── constants/         # Valores iniciais de formulários, listas de estados e abas
├── services/
│   ├── api.js         # request() e authRequest() — wrapper sobre fetch com JWT
│   └── auth.js        # get/set/removeToken e isAuthenticated
└── utils/
    ├── apiHelpers.js  # buildQuery, compactPayload, getErrorMessage, pageContent
    └── formatters.js  # toInputDateTime e demais formatadores
```

---

## Como executar

### Pré-requisitos

- Node.js 20+
- A [API back-end](https://github.com/silvio-tav/it-neocamp-partidas-futebol-api) em execução

### Passos

```bash
# Clone o repositório
git clone https://github.com/silvio-tav/it-neocamp-partidas-futebol-front-end.git
cd it-neocamp-partidas-futebol-front-end

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

---

## Variáveis de ambiente

Por padrão o Vite usa proxy em `/api` e encaminha as chamadas para `http://localhost:8080`, sem precisar configurar CORS no back-end.

Para apontar para outro endereço, crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:8080
```

---

## Autenticação

O front-end faz `POST /auth/login` com `{ login, senha }` e armazena o token JWT retornado no `localStorage`. Todas as requisições subsequentes enviam o header `Authorization: Bearer <token>`. Ao receber um `401`, o token é removido e o usuário é redirecionado para a tela de login automaticamente.

Crie um usuário de teste conforme descrito no [README da API](https://github.com/silvio-tav/it-neocamp-partidas-futebol-api).
