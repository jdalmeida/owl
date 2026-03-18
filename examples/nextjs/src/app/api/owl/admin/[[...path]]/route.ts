// @author João Gabriel de Almeida

import { NextRequest } from "next/server";
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

const storage = process.env.TRAMA_API_KEY ? undefined : new InMemoryAdapter();

const handlers = createNextHandlers({
  storage,
  basePath: "/api/owl",
});

export async function GET(req: NextRequest) {
  return handlers.serveAdmin(req);
}
