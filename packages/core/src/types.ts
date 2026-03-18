// @author João Gabriel de Almeida

/**
 * Bounding rectangle of a highlighted element
 */
export interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Data captured when user highlights a UI element
 */
export interface HighlightData {
  /** CSS selector or path (e.g. body > div:nth-child(2)) */
  selector: string;
  /** Element position and dimensions */
  boundingRect: BoundingRect;
  /** Base64 screenshot, optional */
  screenshot?: string;
  /** Page URL where feedback was captured */
  pageUrl: string;
}

/**
 * Feedback item stored in the system
 */
export interface Feedback {
  id: string;
  highlight: HighlightData;
  comment: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * Input for creating new feedback (no id, no createdAt)
 */
export interface CreateFeedbackInput {
  highlight: HighlightData;
  comment: string;
  metadata?: Record<string, unknown>;
}
