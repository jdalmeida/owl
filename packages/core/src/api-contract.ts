// @author João Gabriel de Almeida

import type { Feedback, CreateFeedbackInput } from "./types.js";

/**
 * POST /feedback - Request body for creating feedback
 */
export type CreateFeedbackRequest = CreateFeedbackInput;

/**
 * POST /feedback - Response
 */
export interface CreateFeedbackResponse {
  feedback: Feedback;
}

/**
 * GET /feedback - Query params
 */
export interface ListFeedbackQuery {
  pageUrl?: string;
  limit?: string;
  offset?: string;
}

/**
 * GET /feedback - Response
 */
export interface ListFeedbackResponse {
  feedbacks: Feedback[];
}
