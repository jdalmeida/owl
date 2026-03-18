// @author João Gabriel de Almeida

import { useElementSelector } from "./useElementSelector.js";
import type { HighlightData } from "@owl/core";

export interface FeedbackOverlayProps {
  enabled: boolean;
  onSelect: (highlight: HighlightData) => void;
  onCancel: () => void;
  highlightStyle?: React.CSSProperties;
}

export function FeedbackOverlay({
  enabled,
  onSelect,
  onCancel,
  highlightStyle = {
    outline: "2px solid #3b82f6",
    outlineOffset: "2px",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
}: FeedbackOverlayProps) {
  const { hoveredElement, overlayRef } = useElementSelector({
    enabled,
    onSelect,
    onCancel,
  });

  if (!enabled) return null;

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483646,
          cursor: "crosshair",
        }}
        aria-label="Select element to add feedback"
      />
      {hoveredElement && (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 2147483645,
            ...getHighlightStyles(hoveredElement),
            ...highlightStyle,
          }}
        />
      )}
    </>
  );
}

function getHighlightStyles(element: Element): React.CSSProperties {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}
