// @author João Gabriel de Almeida

import type { Feedback, CreateFeedbackInput, OwlStorageAdapter, ListFeedbackOptions } from "@owl/core";

export class InMemoryAdapter implements OwlStorageAdapter {
  private feedbacks: Map<string, Feedback> = new Map();

  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const id = crypto.randomUUID();
    const feedback: Feedback = {
      id,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async list(options?: ListFeedbackOptions): Promise<Feedback[]> {
    let items = Array.from(this.feedbacks.values());

    if (options?.pageUrl) {
      const url = options.pageUrl.toLowerCase();
      items = items.filter((f) =>
        f.highlight.pageUrl.toLowerCase().includes(url)
      );
    }

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return items.slice(offset, offset + limit);
  }

  async getById(id: string): Promise<Feedback | null> {
    return this.feedbacks.get(id) ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return this.feedbacks.delete(id);
  }
}
