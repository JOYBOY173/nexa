import { useCallback, useState } from "react";

/**
 * Wraps any async Nexa API call with consistent loading/error state so
 * components don't each reinvent "is this thinking, did it fail" logic.
 */
export function useAI() {
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setStatus("loading");
    setError(null);
    try {
      const result = await fn();
      setStatus("success");
      return result;
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Nexa couldn't complete that request.");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, isLoading: status === "loading", run, reset };
}
