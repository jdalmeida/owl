# Owl

Biblioteca full-stack para coleta de feedback com highlight de UI em React.

## Pacotes

- **@owl/core** - Tipos, interfaces e contratos compartilhados
- **@owl/react** - Componentes React, hooks e cliente API
- **@owl/server** - Handlers framework-agnósticos, Admin UI e InMemoryAdapter
- **@owl/sqlite** - Adapter SQLite (requer Bun)

## Instalação

```bash
bun add @owl/core @owl/react @owl/server
```

## Uso Rápido

### Frontend (React)

```tsx
import { FeedbackProvider, FeedbackWidget } from "@owl/react";

export default function Layout({ children }) {
  return (
    <FeedbackProvider apiUrl="/api/owl">
      {children}
      <FeedbackWidget position="bottom-right" />
    </FeedbackProvider>
  );
}
```

### Backend (Next.js App Router)

```ts
// app/api/owl/route.ts
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

const storage = new InMemoryAdapter();
const handlers = createNextHandlers({ storage, basePath: "/api/owl" });

export const POST = handlers.postFeedback;
export const GET = handlers.getFeedbacks;
```

```ts
// app/api/owl/admin/[[...path]]/route.ts
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

const storage = new InMemoryAdapter();
const handlers = createNextHandlers({ storage, basePath: "/api/owl" });

export const GET = handlers.serveAdmin;
```

### Autenticação

Passe uma função `auth` para proteger as rotas:

```ts
const handlers = createNextHandlers({
  storage,
  auth: async (req) => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");
    return session.user;
  },
});
```

## Build

```bash
bun install
cd packages/core && bun run build
cd packages/react && bun run build
cd packages/server && bun run build
```

## Exemplo

```bash
cd examples/nextjs && bun run dev
```

Acesse http://localhost:3000 e use o botão de feedback. A interface admin está em http://localhost:3000/api/owl/admin.
