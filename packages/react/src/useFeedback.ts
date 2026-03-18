// @author João Gabriel de Almeida

import { useFeedbackContext } from "./FeedbackContext.jsx";

/**
 * Hook to access feedback functionality.
 * Must be used within FeedbackProvider.
 */
export function useFeedback() {
  const ctx = useFeedbackContext();
  return {
    isActive: ctx.isActive,
    startFeedbackMode: ctx.startFeedbackMode,
    cancelFeedbackMode: ctx.cancelFeedbackMode,
    sendFeedback: ctx.sendFeedback,
  };
}
