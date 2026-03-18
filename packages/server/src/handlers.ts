// @author João Gabriel de Almeida

import type {
  OwlStorageAdapter,
  CreateFeedbackInput,
  ListFeedbackOptions,
} from "@owl/core";
import { createTramaAdapter } from "@owl/trama";

export interface HandlerRequest {
  method: string;
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface HandlerResponse {
  status(code: number): HandlerResponse;
  json(data: unknown): void;
  send(data: string): void;
  setHeader(name: string, value: string): HandlerResponse;
}

export interface CreateHandlersOptions {
  /** Storage adapter. When omitted, uses Trama adapter with TRAMA_API_KEY from env (URL padrão: https://tramaai.com). */
  storage?: OwlStorageAdapter;
  basePath?: string;
  auth?: (req: HandlerRequest) => Promise<unknown>;
}

function resolveStorage(storage?: OwlStorageAdapter): OwlStorageAdapter {
  if (storage) {
    return storage;
  }
  const apiKey = process.env.TRAMA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Configure TRAMA_API_KEY no ambiente, ou passe um storage adapter para createHandlers."
    );
  }
  const url = "https://tramaai.com";
  return createTramaAdapter({ url, apiKey });
}

function parseJsonBody(body: unknown): CreateFeedbackInput | null {
  if (typeof body === "object" && body !== null && "highlight" in body && "comment" in body) {
    return body as CreateFeedbackInput;
  }
  return null;
}

function parseQuery(url: string): Record<string, string> {
  const idx = url.indexOf("?");
  if (idx === -1) return {};
  const params = new URLSearchParams(url.slice(idx));
  const result: Record<string, string> = {};
  params.forEach((v, k) => {
    result[k] = v;
  });
  return result;
}

export function createHandlers(options: CreateHandlersOptions) {
  const { basePath = "/api/owl", auth } = options;
  const storage = resolveStorage(options.storage);
  const base = basePath.replace(/\/$/, "");

  async function postFeedback(req: HandlerRequest, res: HandlerResponse): Promise<void> {
    try {
      const input = parseJsonBody(req.body);
      if (!input?.highlight?.selector || !input?.comment) {
        res.status(400).json({ error: "Missing highlight or comment" });
        return;
      }
      const feedback = await storage.create(input);
      res.status(201).json({ feedback });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Internal server error",
      });
    }
  }

  async function getFeedbacks(req: HandlerRequest, res: HandlerResponse): Promise<void> {
    try {
      if (auth) {
        await auth(req);
      }
      const query = parseQuery(req.url);
      const options: ListFeedbackOptions = {
        pageUrl: query.pageUrl,
        limit: query.limit ? parseInt(query.limit, 10) : undefined,
        offset: query.offset ? parseInt(query.offset, 10) : undefined,
      };
      const feedbacks = await storage.list(options);
      res.status(200).json({ feedbacks });
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : "Internal server error",
      });
    }
  }

  return { postFeedback, getFeedbacks };
}
