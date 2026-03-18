// @author João Gabriel de Almeida

import { NextRequest } from "next/server";
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

// Sem storage = usa Trama adapter (TRAMA_API_KEY no .env, URL: https://tramaai.com)
// Com storage = usa o adapter informado (ex: InMemory para demo local)
const storage = process.env.TRAMA_API_KEY ? undefined : new InMemoryAdapter();

const handlers = createNextHandlers({
  storage,
  basePath: "/api/owl",
});

export async function POST(req: NextRequest) {
  return handlers.postFeedback(req);
}

export async function GET(req: NextRequest) {
  return handlers.getFeedbacks(req);
}
