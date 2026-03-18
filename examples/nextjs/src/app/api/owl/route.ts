// @author João Gabriel de Almeida

import { NextRequest } from "next/server";
import { createNextHandlers } from "@owl/server/next";
import { InMemoryAdapter } from "@owl/server";

const storage = new InMemoryAdapter();
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
