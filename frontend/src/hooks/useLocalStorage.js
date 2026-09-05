import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A small localStorage-backed state hook. Reads once on mount, writes on
 * every change, and fails gracefully (falling back to `initialValue`) if
 * the stored payload is missing or corrupted rather than throwing.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Nexa: could not read localStorage key "${key}", using defaults.`, error);
      return initialValue;
    }
  });

  const isFirstRun = useRef(true);

  useEffect(() => {
    // Avoid an extra redundant write on mount.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Nexa: could not persist localStorage key "${key}".`, error);
    }
  }, [key, value]);

  const reset = useCallback(
    (nextValue) => {
      setValue(nextValue);
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch (error) {
        console.warn(`Nexa: could not persist localStorage key "${key}".`, error);
      }
    },
    [key]
  );

  return [value, setValue, reset];
}
