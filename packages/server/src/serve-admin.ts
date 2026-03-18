// @author João Gabriel de Almeida

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(pathname: string): string {
  const ext = pathname.slice(pathname.lastIndexOf("."));
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function getAdminDistPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, "..", "admin-dist");
}

export interface ServeAdminOptions {
  auth?: (req: Request) => Promise<unknown>;
  /** Base path where admin is mounted (e.g. /api/owl/admin). Used to strip prefix from request path. */
  basePath?: string;
}

/**
 * Create a handler that serves the Admin UI static files.
 * Returns a function that accepts a Request and returns a Response.
 */
export function createServeAdmin(options: ServeAdminOptions = {}) {
  const { auth, basePath = "/admin" } = options;
  const adminPath = getAdminDistPath();
  const base = basePath.replace(/\/$/, "");

  return async function serveAdmin(request: Request): Promise<Response> {
    try {
      if (auth) {
        await auth(request);
      }
    } catch {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!existsSync(adminPath)) {
      return new Response(
        JSON.stringify({
          error: "Admin UI not built. Run: cd packages/server && bun run build",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(request.url);
    let pathname = url.pathname;
    if (pathname.startsWith(base)) {
      pathname = pathname.slice(base.length) || "/";
    }
    pathname = pathname.replace(/\/$/, "") || "/index.html";
    if (pathname === "/") pathname = "/index.html";
    if (!pathname.startsWith("/")) pathname = "/" + pathname;

    const filePath = join(adminPath, ...pathname.slice(1).split("/"));

    if (!filePath.startsWith(adminPath)) {
      return new Response(null, { status: 403 });
    }

    let actualPath = filePath;
    if (!existsSync(filePath)) {
      const indexPath = join(adminPath, "index.html");
      if (existsSync(indexPath)) {
        actualPath = indexPath;
      } else {
        return new Response(null, { status: 404 });
      }
    }

    const content = readFileSync(actualPath);
    const mime = getMimeType(pathname);
    return new Response(content, {
      status: 200,
      headers: { "Content-Type": mime },
    });
  };
}
