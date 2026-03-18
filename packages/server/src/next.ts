// @author João Gabriel de Almeida

import { NextRequest, NextResponse } from "next/server";
import type { OwlStorageAdapter } from "@owl/core";
import { createHandlers } from "./handlers.js";
import { createServeAdmin } from "./serve-admin.js";

export interface CreateNextHandlersOptions {
  storage: OwlStorageAdapter;
  basePath?: string;
  /** Base path for admin UI (e.g. /api/owl/admin). Defaults to basePath + /admin */
  adminBasePath?: string;
  auth?: (req: NextRequest) => Promise<unknown>;
}

export function createNextHandlers(options: CreateNextHandlersOptions) {
  const { storage, basePath = "/api/owl", adminBasePath, auth } = options;
  const adminPath = adminBasePath ?? `${basePath.replace(/\/$/, "")}/admin`;

  const handlers = createHandlers({
    storage,
    basePath,
    auth: auth
      ? async (req) => {
          const nextReq = new NextRequest(req.url, {
            method: req.method,
            body: req.body ? JSON.stringify(req.body) : undefined,
          });
          return auth(nextReq);
        }
      : undefined,
  });

  const serveAdmin = createServeAdmin({
    auth: auth
      ? async (req) => auth(req as unknown as NextRequest)
      : undefined,
    basePath: adminPath,
  });

  return {
    async postFeedback(req: NextRequest) {
      const body = await req.json().catch(() => ({}));
      const res = createMockResponse();
      await handlers.postFeedback(
        { method: req.method, url: req.url, body },
        res
      );
      return NextResponse.json(res._json ?? res._body, { status: res._status });
    },
    async getFeedbacks(req: NextRequest) {
      const res = createMockResponse();
      await handlers.getFeedbacks(
        { method: req.method, url: req.url },
        res
      );
      return NextResponse.json(res._json ?? res._body, { status: res._status });
    },
    async serveAdmin(req: NextRequest) {
      return serveAdmin(req as unknown as Request);
    },
  };
}

function createMockResponse() {
  let _status = 200;
  let _json: unknown = null;
  let _body: string | undefined;
  const res = {
    get _status() {
      return _status;
    },
    get _json() {
      return _json;
    },
    get _body() {
      return _body;
    },
    status(code: number) {
      _status = code;
      return res;
    },
    setHeader() {
      return res;
    },
    json(data: unknown) {
      _json = data;
    },
    send(data: string) {
      _body = data;
    },
    end(data?: Buffer) {
      if (data) _body = data.toString();
    },
  };
  return res as {
    _status: number;
    _json: unknown;
    _body?: string;
    status: (n: number) => typeof res;
    setHeader: () => typeof res;
    json: (d: unknown) => void;
    send: (d: string) => void;
    end: (d?: Buffer) => void;
  };
}
