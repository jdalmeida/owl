# @owl/sqlite

Adapter SQLite para Owl, usando o `bun:sqlite` nativo do Bun.

**Requer runtime Bun.**

## Uso

```ts
import { createSqliteAdapter } from "@owl/sqlite";

const storage = createSqliteAdapter({ dbPath: "./feedback.sqlite" });
```
