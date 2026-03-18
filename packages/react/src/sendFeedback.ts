// @author João Gabriel de Almeida

import type { CreateFeedbackInput, Feedback } from "@owl/core";

export interface SendFeedbackOptions {
  apiUrl: string;
  headers?: Record<string, string>;
}

export interface SendFeedbackResult {
  feedback: Feedback;
}

/**
 * Send feedback to the API. Can be used standalone or via useFeedback.
 */
export async function sendFeedback(
  input: CreateFeedbackInput,
  options: SendFeedbackOptions
): Promise<SendFeedbackResult> {
  const { apiUrl, headers = {} } = options;
  const url = apiUrl.replace(/\/$/, "") + "/feedback";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to send feedback: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { feedback: Feedback };
  return data;
}
