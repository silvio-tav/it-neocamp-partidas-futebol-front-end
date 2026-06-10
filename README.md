# Frontend - Partidas de Futebol

Interface React minimalista para consumir a API Spring Boot de clubes, estádios, partidas, ranking e retrospecto.

## Como executar

Com a API Spring Boot rodando em `http://localhost:8080`:

```bash
npm install
npm run dev
```

O Vite usa proxy em `/api`, então as chamadas do front são encaminhadas para a API local sem exigir CORS no backend.

## API em outro endereço

Crie um arquivo `.env` com:

```env
VITE_API_URL=http://localhost:8080
```

Se essa variável não existir, o front usa `/api`.
