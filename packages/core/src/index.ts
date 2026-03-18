// @author João Gabriel de Almeida

/** Package version */
export const OWL_CORE_VERSION = "0.1.0";

export type {
  BoundingRect,
  HighlightData,
  Feedback,
  CreateFeedbackInput,
} from "./types.js";

export type {
  OwlStorageAdapter,
  ListFeedbackOptions,
} from "./storage.js";

export type {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  ListFeedbackQuery,
  ListFeedbackResponse,
} from "./api-contract.js";
