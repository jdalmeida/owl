// @author João Gabriel de Almeida

import type { Feedback, CreateFeedbackInput } from "./types.js";

/**
 * Storage adapter interface for Owl feedback persistence.
 * Implement this interface to plug in your own storage (Postgres, MongoDB, etc.)
 */
export interface OwlStorageAdapter {
  /** Create a new feedback entry */
  create(input: CreateFeedbackInput): Promise<Feedback>;

  /** List all feedbacks, optionally filtered */
  list(options?: ListFeedbackOptions): Promise<Feedback[]>;

  /** Get a single feedback by ID */
  getById(id: string): Promise<Feedback | null>;

  /** Delete a feedback by ID */
  delete(id: string): Promise<boolean>;
}

export interface ListFeedbackOptions {
  /** Filter by page URL (partial match) */
  pageUrl?: string;
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}
