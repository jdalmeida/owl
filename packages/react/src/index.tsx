// @author João Gabriel de Almeida

export { FeedbackProvider, useFeedbackContext } from "./FeedbackContext.jsx";
export { FeedbackWidget } from "./FeedbackWidget.jsx";
export { FeedbackOverlay } from "./FeedbackOverlay.jsx";
export { CommentForm } from "./CommentForm.jsx";
export { useFeedback } from "./useFeedback.js";
export { sendFeedback } from "./sendFeedback.js";
export { getSelector } from "./getSelector.js";

export type { FeedbackProviderProps, FeedbackContextValue } from "./FeedbackContext.jsx";
export type { FeedbackWidgetProps, FeedbackWidgetPosition } from "./FeedbackWidget.jsx";
export type { CommentFormProps } from "./CommentForm.jsx";
export type { SendFeedbackOptions, SendFeedbackResult } from "./sendFeedback.js";
