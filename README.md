# appConectarDiscord

## Visão geral

Esta solução permite que jogadores encontrem anúncios (ads) de outros jogadores para formar times ou partidas. A arquitetura é dividida em três partes:

- Mobile: app React Native (Expo) usado para navegação e interação nativa (Android / iOS / Web via Expo). Ideal para jogadores usarem no celular.
- Web: SPA React (Vite) com Tailwind — contém a interface para criar anúncios e visualizar banners de jogos.
- Server: API REST em Node + Express que expõe endpoints para listar jogos, criar anúncios, listar anúncios por jogo e buscar o Discord de um anúncio. O banco usado é SQLite gerenciado pelo Prisma.

## Estrutura do repositório (resumo)

- `mobile/` — App React Native (Expo). Contém `App.tsx`, `package.json` e pasta `src` com componentes e telas.
- `web/` — Frontend web com Vite + React + Tailwind. Contém `src/` com componentes e estilos.
- `server/` — API REST em TypeScript com Express e Prisma. Contém `src/server.ts`, `prisma/schema.prisma` e scripts para desenvolvimento.

## Tecnologias principais

- Mobile: Expo, React Native, React Navigation, Expo Notifications.
- Web: React, Vite, TypeScript, Tailwind CSS, Axios.
- Server: Node, Express, TypeScript, Prisma (SQLite), CORS.

## Server — API (endpoints e modelos)

Banco de dados (Prisma, SQLite)

Modelos principais (resumido do `prisma/schema.prisma`):

- Game
  - id (uuid)
  - title
  - bannerUrl
  - ads[] (relação)

- Ad
  - id (uuid)
  - gameId (fk)
  - name
  - yearsPlaying (int)
  - discord (string)
  - weekDays (string armazenado como CSV no banco; API converte para array)
  - hourStart (int, minutos)
  - hourEnd (int, minutos)
  - useVoiceChannel (boolean)
  - createdAt

Endpoints principais (definidos em `server/src/server.ts`):

- GET /games
  - Retorna a lista de jogos com um contador de anúncios (\_count.ads).
  - Exemplo de retorno: [{ id, title, bannerUrl, _count: { ads: 3 } }, ...]

- POST /games/:gameId/ads
  - Cria um anúncio para o jogo indicado (`gameId`).
  - Body esperado (JSON):
    - name: string
    - yearsPlaying: number
    - discord: string
    - weekDays: string[] (ex: ["1","3","5"] ou ["0","2"]) — no servidor é salvo como CSV
    - hourStart: string (ex: "18:00")
    - hourEnd: string (ex: "22:30")
    - useVoiceChannel: boolean
  - O servidor converte `hourStart`/`hourEnd` em minutos antes de salvar.
  - Retorno: objeto do anúncio criado (status 201).

- GET /games/:id/ads
  - Lista anúncios associados ao jogo `id`.
  - Retorno: array de anúncios com campos: id, name, weekDays (array), useVoiceChannel, yearsPlaying, hourStart ("HH:MM"), hourEnd ("HH:MM").

- GET /ads/:id/discord
  - Retorna o campo `{ discord: string }` do anúncio com o id fornecido.

Observações do servidor

- O servidor usa CORS aberto por padrão (permitindo que qualquer front-end consuma a API). Em produção, configure a origem apropriadamente.
- Variável esperada para o banco: `DATABASE_URL` (no `prisma` está configurado para SQLite; comumente `file:./dev.db`).

## Como rodar localmente

Recomendações: use Node >= 16 e npm ou yarn.

1. Server (API)

No diretório `server/`:

```bash
cd server
npm install
# gerar client do prisma
npx prisma generate
# (opcional) aplicar migrations em dev e criar o arquivo SQLite
npx prisma migrate dev
# rodar em modo dev (usa ts-node-dev)
npm run dev
```

O servidor, por padrão, escuta na porta `3333`.

2. Web (frontend)

No diretório `web/`:

```bash
cd web
npm install
npm run dev
```

Abre a aplicação web em `http://localhost:5173` (porta padrão do Vite) — confirme no terminal o endereço exato.

3. Mobile (Expo)

No diretório `mobile/`:

```bash
cd mobile
npm install
# iniciar o Metro/Expo
npm run start
```

Use o app Expo Go no celular (ou emulador Android/iOS) para abrir o projeto. Você pode também rodar `npm run android`, `npm run ios` ou `npm run web` conforme necessário.

## Contrato leve da API (inputs / outputs)

- Input principal para `POST /games/:gameId/ads` — JSON com os campos descritos acima.
- Outputs: JSON com recursos criados/listados; erros retornam códigos HTTP padrão (4xx/5xx).

Edge cases a considerar

- weekDays é armazenado como CSV; front-ends devem enviar um array e esperar um array ao receber.
- Validação mínima presente — proteger endpoints e validar dados em produção.
- Horários convertidos para minutos; formatadores cuidam da conversão ao exibir.

## Desenvolvimento e contribuições

- Sinta-se à vontade para abrir issues e pull requests.
- Sugestões de melhorias: autenticação, paginação dos anúncios, filtros por disponibilidade, testes automatizados e deploy com variáveis de ambiente seguras.

## Observações finais

Este README foi gerado/atualizado para descrever a finalidade de cada parte do monorepo e facilitar que novos colaboradores ou você mesmo voltem ao projeto sem perder contexto.

Se quiser, posso:

- adicionar exemplos de requests (curl / HTTPie) para cada endpoint;
- gerar um Postman/Insomnia collection;
- adicionar ações de CI simples ou scripts de start mais automatizados.

---

Licença: ver repositório (ou adicione uma license se desejar).

<h1 align="center">Aplicação feita durante a NLW Esports</h1>

## 🚀 Tecnologias

Techs utilizadas:

- ReactJS
- Vite
- TypeScript
- Axios
- Tailwind
- Node
- Prisma
- React Native
- Style Components
