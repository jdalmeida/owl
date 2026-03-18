# @owl/trama

Adapter do Owl que envia feedbacks ao [Trama](https://trama.com) como insights de cliente em vez de persistir em banco.

## Instalação

```bash
bun add @owl/trama
```

## Uso

### Como adapter explícito

```ts
import { createNextHandlers } from "@owl/server/next";
import { createTramaAdapter } from "@owl/trama";

const storage = createTramaAdapter({
  url: "https://tramaai.com",
  apiKey: process.env.TRAMA_API_KEY!,
});

const handlers = createNextHandlers({ storage, basePath: "/api/owl" });
```

### Como padrão (sem storage)

Quando `storage` não é informado em `createNextHandlers`, o Owl usa o Trama adapter automaticamente se `TRAMA_API_KEY` estiver definida no ambiente (URL padrão: https://tramaai.com).

```ts
const handlers = createNextHandlers({ basePath: "/api/owl" });
```

A API key permanece apenas no backend — nunca é exposta no frontend.
