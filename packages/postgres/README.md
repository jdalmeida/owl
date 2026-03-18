# @owl/postgres

Adapter PostgreSQL para Owl feedback. Usa [postgres.js](https://github.com/porsager/postgres).

## Instalação

```bash
bun add @owl/postgres postgres
```

## Uso

```ts
import { createPostgresAdapter } from "@owl/postgres";

const storage = createPostgresAdapter({
  connection: process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/db",
  table: "owl_feedback", // opcional, default: owl_feedback
});
```

## Opções

| Opção       | Tipo                    | Descrição                                              |
| ----------- | ----------------------- | ------------------------------------------------------ |
| connection  | string \| postgres.Options | Connection string ou objeto de configuração postgres.js |
| table       | string                  | Nome da tabela (default: owl_feedback)                 |

A tabela é criada automaticamente na primeira operação.
