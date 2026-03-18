# @owl/server

Handlers framework-agnósticos, Admin UI e adapters de storage.

## Handlers

```ts
import { createHandlers, InMemoryAdapter } from "@owl/server";

const storage = new InMemoryAdapter();
const { postFeedback, getFeedbacks } = createHandlers({ storage });
```

## Next.js

```ts
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

const storage = new InMemoryAdapter();
const handlers = createNextHandlers({ storage, basePath: "/api/owl" });

export const POST = handlers.postFeedback;
export const GET = handlers.getFeedbacks;
```

Para servir o Admin UI, crie uma rota em `app/api/owl/admin/[[...path]]/route.ts`:

```ts
export const GET = handlers.serveAdmin;
```

## Build do Admin

Execute `bun run build` no pacote para gerar os arquivos estáticos em `admin-dist/`.
