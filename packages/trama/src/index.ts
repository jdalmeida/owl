// @author João Gabriel de Almeida

import type {
  OwlStorageAdapter,
  Feedback,
  CreateFeedbackInput,
  ListFeedbackOptions,
} from "@owl/core";

export interface TramaAdapterOptions {
  /** URL base do Trama (ex: https://app.trama.com) */
  url: string;
  /** Workspace API key do Trama */
  apiKey: string;
}

function formatFeedbackForTrama(input: CreateFeedbackInput): {
  title: string;
  content: string;
  metadata: Record<string, unknown>;
} {
  const { highlight, comment } = input;
  const title =
    comment.trim().slice(0, 80) || `Feedback em ${highlight.pageUrl}`;
  const content = `[Feedback Owl]\n\n${comment}\n\nPágina: ${highlight.pageUrl}\nElemento: ${highlight.selector}\nPosição: ${JSON.stringify(highlight.boundingRect)}`;
  const metadata: Record<string, unknown> = {
    pageUrl: highlight.pageUrl,
    selector: highlight.selector,
  };
  return { title, content, metadata };
}

/**
 * Trama storage adapter for Owl feedback.
 * Sends feedbacks to Trama as customer insights instead of persisting locally.
 * list, getById and delete are no-ops since insights live in Trama.
 */
export function createTramaAdapter(
  options: TramaAdapterOptions
): OwlStorageAdapter {
  const baseUrl = options.url.replace(/\/$/, "");
  const apiKey = options.apiKey;

  return {
    async create(input: CreateFeedbackInput): Promise<Feedback> {
      const { title, content, metadata } = formatFeedbackForTrama(input);
      const response = await fetch(`${baseUrl}/api/insights/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ title, content, metadata }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Trama API error (${response.status}): ${text}`
        );
      }

      const data = (await response.json()) as { insightId: string };
      const insightId = data.insightId;
      const createdAt = new Date().toISOString();

      return {
        id: insightId,
        highlight: input.highlight,
        comment: input.comment,
        createdAt,
        metadata: input.metadata,
      };
    },

    async list(_options?: ListFeedbackOptions): Promise<Feedback[]> {
      return [];
    },

    async getById(_id: string): Promise<Feedback | null> {
      return null;
    },

    async delete(_id: string): Promise<boolean> {
      return false;
    },
  };
}
