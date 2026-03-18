// @author João Gabriel de Almeida
"use client";

import { FeedbackProvider, FeedbackWidget } from "@owl/react";

export function FeedbackClient({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider apiUrl="/api/owl">
      {children}
      <FeedbackWidget position="bottom-right" />
    </FeedbackProvider>
  );
}
