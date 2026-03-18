// @author João Gabriel de Almeida

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CreateFeedbackInput, HighlightData } from "@owl/core";
import { sendFeedback } from "./sendFeedback.js";

export interface FeedbackContextValue {
  apiUrl: string;
  headers?: Record<string, string>;
  isActive: boolean;
  startFeedbackMode: () => void;
  cancelFeedbackMode: () => void;
  sendFeedback: (input: CreateFeedbackInput) => Promise<void>;
  onSubmit?: (input: CreateFeedbackInput) => void | Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export interface FeedbackProviderProps {
  children: ReactNode;
  apiUrl: string;
  headers?: Record<string, string>;
  onSubmit?: (input: CreateFeedbackInput) => void | Promise<void>;
}

export function FeedbackProvider({
  children,
  apiUrl,
  headers,
  onSubmit,
}: FeedbackProviderProps) {
  const [isActive, setIsActive] = useState(false);

  const startFeedbackMode = useCallback(() => setIsActive(true), []);
  const cancelFeedbackMode = useCallback(() => setIsActive(false), []);

  const handleSendFeedback = useCallback(
    async (input: CreateFeedbackInput) => {
      await onSubmit?.(input);
      await sendFeedback(input, { apiUrl, headers });
      setIsActive(false);
    },
    [apiUrl, headers, onSubmit]
  );

  const value = useMemo<FeedbackContextValue>(
    () => ({
      apiUrl,
      headers,
      isActive,
      startFeedbackMode,
      cancelFeedbackMode,
      sendFeedback: handleSendFeedback,
      onSubmit,
    }),
    [
      apiUrl,
      headers,
      isActive,
      startFeedbackMode,
      cancelFeedbackMode,
      handleSendFeedback,
      onSubmit,
    ]
  );

  return (
    <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
  );
}

export function useFeedbackContext(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedbackContext must be used within FeedbackProvider");
  }
  return ctx;
}
