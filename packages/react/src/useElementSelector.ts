// @author João Gabriel de Almeida

import { useCallback, useEffect, useRef, useState } from "react";
import type { HighlightData } from "@owl/core";
import { getSelector } from "./getSelector.js";

export interface UseElementSelectorOptions {
  enabled: boolean;
  onSelect: (highlight: HighlightData) => void;
  onCancel: () => void;
}

export function useElementSelector({
  enabled,
  onSelect,
  onCancel,
}: UseElementSelectorOptions) {
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const captureHighlight = useCallback(
    (element: Element): HighlightData => {
      const rect = element.getBoundingClientRect();
      const selector = getSelector(element);

      return {
        selector,
        boundingRect: {
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleMouseMove = (e: MouseEvent) => {
      const originalPointerEvents = overlay.style.pointerEvents;
      overlay.style.pointerEvents = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY);
      overlay.style.pointerEvents = originalPointerEvents;
      if (target && target !== overlay && !overlay.contains(target)) {
        setHoveredElement(target);
      } else {
        setHoveredElement(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const originalPointerEvents = overlay.style.pointerEvents;
      overlay.style.pointerEvents = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY);
      overlay.style.pointerEvents = originalPointerEvents;
      if (target && target !== overlay && !overlay.contains(target)) {
        const highlight = captureHighlight(target);
        onSelect(highlight);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    overlay.addEventListener("mousemove", handleMouseMove);
    overlay.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      overlay.removeEventListener("mousemove", handleMouseMove);
      overlay.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onSelect, onCancel, captureHighlight]);

  return { hoveredElement, overlayRef };
}
