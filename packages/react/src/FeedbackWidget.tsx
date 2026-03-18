// @author João Gabriel de Almeida

import { useState, useCallback } from "react";
import { useFeedbackContext } from "./FeedbackContext.jsx";
import { FeedbackOverlay } from "./FeedbackOverlay.jsx";
import { CommentForm } from "./CommentForm.jsx";
import type { HighlightData } from "@owl/core";

export type FeedbackWidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export interface FeedbackWidgetProps {
  position?: FeedbackWidgetPosition;
  /** Custom trigger element. If not provided, uses default button */
  trigger?: React.ReactNode;
  /** Custom styles for the default button */
  buttonStyle?: React.CSSProperties;
  /** Custom highlight style for the overlay */
  highlightStyle?: React.CSSProperties;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

const positionStyles: Record<
  FeedbackWidgetPosition,
  { bottom?: number; top?: number; left?: number; right?: number }
> = {
  "bottom-right": { bottom: 24, right: 24 },
  "bottom-left": { bottom: 24, left: 24 },
  "top-right": { top: 24, right: 24 },
  "top-left": { top: 24, left: 24 },
};

export function FeedbackWidget({
  position = "bottom-right",
  trigger,
  buttonStyle,
  highlightStyle,
  placeholder,
  submitLabel,
  cancelLabel,
}: FeedbackWidgetProps) {
  const {
    isActive,
    startFeedbackMode,
    cancelFeedbackMode,
    sendFeedback,
  } = useFeedbackContext();
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightData | null>(
    null
  );

  const handleSelect = useCallback((highlight: HighlightData) => {
    setSelectedHighlight(highlight);
  }, []);

  const handleSubmitComment = useCallback(
    async (comment: string) => {
      if (!selectedHighlight) return;
      await sendFeedback({ highlight: selectedHighlight, comment });
      setSelectedHighlight(null);
    },
    [selectedHighlight, sendFeedback]
  );

  const handleCancelComment = useCallback(() => {
    setSelectedHighlight(null);
    cancelFeedbackMode();
  }, [cancelFeedbackMode]);

  const pos = positionStyles[position];

  return (
    <>
      <FeedbackOverlay
        enabled={isActive && !selectedHighlight}
        onSelect={handleSelect}
        onCancel={cancelFeedbackMode}
        highlightStyle={highlightStyle}
      />
      {selectedHighlight && (
        <CommentForm
          highlight={selectedHighlight}
          onSubmit={handleSubmitComment}
          onCancel={handleCancelComment}
          placeholder={placeholder}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
        />
      )}
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          onClick={isActive ? cancelFeedbackMode : startFeedbackMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              isActive ? cancelFeedbackMode() : startFeedbackMode();
            }
          }}
          aria-label={isActive ? "Cancel feedback" : "Add feedback"}
          style={{
            position: "fixed",
            ...pos,
            zIndex: 2147483644,
            cursor: "pointer",
          }}
        >
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={isActive ? cancelFeedbackMode : startFeedbackMode}
          aria-label={isActive ? "Cancel feedback" : "Add feedback"}
          style={{
            position: "fixed",
            ...pos,
            zIndex: 2147483644,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: isActive ? "#ef4444" : "#3b82f6",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            ...buttonStyle,
          }}
        >
          💬
        </button>
      )}
    </>
  );
}
