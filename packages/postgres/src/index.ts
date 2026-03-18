// @author João Gabriel de Almeida

import postgres from "postgres";
import type {
  OwlStorageAdapter,
  Feedback,
  CreateFeedbackInput,
  ListFeedbackOptions,
} from "@owl/core";

export interface PostgresAdapterOptions {
  /** Connection string ou objeto de configuração do postgres.js */
  connection: string | postgres.Options<Record<string, never>>;
  /** Nome da tabela (default: owl_feedback) */
  table?: string;
}

type Sql = postgres.Sql;

function rowToFeedback(row: {
  id: string;
  selector: string;
  bounding_rect: unknown;
  page_url: string;
  screenshot: string | null;
  comment: string;
  metadata: unknown;
  created_at: string;
}): Feedback {
  return {
    id: row.id,
    highlight: {
      selector: row.selector,
      boundingRect:
        typeof row.bounding_rect === "object" && row.bounding_rect !== null
          ? (row.bounding_rect as Feedback["highlight"]["boundingRect"])
          : (JSON.parse(
              String(row.bounding_rect)
            ) as Feedback["highlight"]["boundingRect"]),
      pageUrl: row.page_url,
      screenshot: row.screenshot ?? undefined,
    },
    comment: row.comment,
    createdAt: row.created_at,
    metadata:
      row.metadata != null
        ? typeof row.metadata === "object"
          ? (row.metadata as Record<string, unknown>)
          : (JSON.parse(String(row.metadata)) as Record<string, unknown>)
        : undefined,
  };
}

/**
 * PostgreSQL storage adapter for Owl feedback.
 * Uses postgres.js for connection.
 */
export function createPostgresAdapter(
  options: PostgresAdapterOptions
): OwlStorageAdapter {
  const sql: Sql =
    typeof options.connection === "string"
      ? postgres(options.connection)
      : postgres(options.connection);
  const table = options.table ?? "owl_feedback";

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  let tableReady: Promise<void> | null = null;
  async function ensureTable() {
    if (!tableReady) {
      tableReady = sql.unsafe(`
        CREATE TABLE IF NOT EXISTS "${table}" (
          id TEXT PRIMARY KEY,
          selector TEXT NOT NULL,
          bounding_rect JSONB NOT NULL,
          page_url TEXT NOT NULL,
          screenshot TEXT,
          comment TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL
        )
      `).then(() => {});
    }
    await tableReady;
  }

  return {
    async create(input: CreateFeedbackInput): Promise<Feedback> {
      await ensureTable();
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      await sql`
        INSERT INTO ${sql(table)} (
          id, selector, bounding_rect, page_url, screenshot, comment, metadata, created_at
        ) VALUES (
          ${id},
          ${input.highlight.selector},
          ${JSON.stringify(input.highlight.boundingRect)},
          ${input.highlight.pageUrl},
          ${input.highlight.screenshot ?? null},
          ${input.comment},
          ${input.metadata ? JSON.stringify(input.metadata) : null},
          ${createdAt}
        )
      `;

      return {
        id,
        highlight: {
          ...input.highlight,
          boundingRect: input.highlight.boundingRect,
        },
        comment: input.comment,
        createdAt,
        metadata: input.metadata,
      };
    },

    async list(options?: ListFeedbackOptions): Promise<Feedback[]> {
      await ensureTable();
      const limit = options?.limit ?? 50;
      const offset = options?.offset ?? 0;

      const rows = options?.pageUrl
        ? await sql`
            SELECT * FROM ${sql(table)}
            WHERE page_url ILIKE ${"%" + options.pageUrl + "%"}
            ORDER BY created_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `
        : await sql`
            SELECT * FROM ${sql(table)}
            ORDER BY created_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `;

      return (rows as unknown as Parameters<typeof rowToFeedback>[0][]).map(rowToFeedback);
    },

    async getById(id: string): Promise<Feedback | null> {
      await ensureTable();
      const rows = await sql`
        SELECT * FROM ${sql(table)} WHERE id = ${id}
      `;
      const row = (rows as unknown as Parameters<typeof rowToFeedback>[0][])[0];
      return row ? rowToFeedback(row) : null;
    },

    async delete(id: string): Promise<boolean> {
      await ensureTable();
      const result = await sql`
        DELETE FROM ${sql(table)} WHERE id = ${id}
        RETURNING id
      `;
      return (result as unknown[]).length > 0;
    },
  };
}
