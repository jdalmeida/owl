// @author João Gabriel de Almeida

import { Database } from "bun:sqlite";
import type {
  OwlStorageAdapter,
  Feedback,
  CreateFeedbackInput,
  ListFeedbackOptions,
} from "@owl/core";

export interface SqliteAdapterOptions {
  /** Path to SQLite database file */
  dbPath: string;
}

/**
 * SQLite storage adapter for Owl feedback.
 * Uses Bun's built-in bun:sqlite. Requires Bun runtime.
 */
export function createSqliteAdapter(
  options: SqliteAdapterOptions
): OwlStorageAdapter {
  const { dbPath } = options;
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS owl_feedback (
      id TEXT PRIMARY KEY,
      selector TEXT NOT NULL,
      bounding_rect TEXT NOT NULL,
      page_url TEXT NOT NULL,
      screenshot TEXT,
      comment TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL
    )
  `);

  const insertStmt = db.prepare(`
    INSERT INTO owl_feedback (id, selector, bounding_rect, page_url, screenshot, comment, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return {
    async create(input: CreateFeedbackInput): Promise<Feedback> {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const boundingRect = JSON.stringify(input.highlight.boundingRect);

      insertStmt.run(
        id,
        input.highlight.selector,
        boundingRect,
        input.highlight.pageUrl,
        input.highlight.screenshot ?? null,
        input.comment,
        input.metadata ? JSON.stringify(input.metadata) : null,
        createdAt
      );

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
      let sql = "SELECT * FROM owl_feedback";
      const params: (string | number)[] = [];

      if (options?.pageUrl) {
        sql += " WHERE page_url LIKE ?";
        params.push(`%${options.pageUrl}%`);
      }
      sql += " ORDER BY created_at DESC";
      if (options?.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }
      if (options?.offset) {
        sql += " OFFSET ?";
        params.push(options.offset);
      }

      const stmt = db.prepare(sql);
      const rows = stmt.all(...params) as Array<{
        id: string;
        selector: string;
        bounding_rect: string;
        page_url: string;
        screenshot: string | null;
        comment: string;
        metadata: string | null;
        created_at: string;
      }>;

      return rows.map((row) => ({
        id: row.id,
        highlight: {
          selector: row.selector,
          boundingRect: JSON.parse(row.bounding_rect) as Feedback["highlight"]["boundingRect"],
          pageUrl: row.page_url,
          screenshot: row.screenshot ?? undefined,
        },
        comment: row.comment,
        createdAt: row.created_at,
        metadata: row.metadata ? (JSON.parse(row.metadata) as Record<string, unknown>) : undefined,
      }));
    },

    async getById(id: string): Promise<Feedback | null> {
      const row = db.prepare("SELECT * FROM owl_feedback WHERE id = ?").get(id) as {
        id: string;
        selector: string;
        bounding_rect: string;
        page_url: string;
        screenshot: string | null;
        comment: string;
        metadata: string | null;
        created_at: string;
      } | undefined;

      if (!row) return null;

      return {
        id: row.id,
        highlight: {
          selector: row.selector,
          boundingRect: JSON.parse(row.bounding_rect) as Feedback["highlight"]["boundingRect"],
          pageUrl: row.page_url,
          screenshot: row.screenshot ?? undefined,
        },
        comment: row.comment,
        createdAt: row.created_at,
        metadata: row.metadata ? (JSON.parse(row.metadata) as Record<string, unknown>) : undefined,
      };
    },

    async delete(id: string): Promise<boolean> {
      const result = db.prepare("DELETE FROM owl_feedback WHERE id = ?").run(id);
      return result.changes > 0;
    },
  };
}
