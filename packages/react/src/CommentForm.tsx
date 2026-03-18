// @author João Gabriel de Almeida

import { useState, useCallback } from "react";
import type { HighlightData } from "@owl/core";

export interface CommentFormProps {
  highlight: HighlightData;
  onSubmit: (comment: string) => void | Promise<void>;
  onCancel: () => void;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

export function CommentForm({
  highlight,
  onSubmit,
  onCancel,
  placeholder = "Describe your feedback...",
  submitLabel = "Send",
  cancelLabel = "Cancel",
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!comment.trim()) return;
      setIsSubmitting(true);
      try {
        await onSubmit(comment.trim());
      } finally {
        setIsSubmitting(false);
      }
    },
    [comment, onSubmit]
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2147483647,
        background: "white",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        minWidth: "320px",
        maxWidth: "90vw",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        Selected: {highlight.selector}
      </p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
        rows={4}
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "14px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
        autoFocus
      />
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            background: "white",
            cursor: "pointer",
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={!comment.trim() || isSubmitting}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
