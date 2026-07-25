import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always start from `initialValue` on both server and client so the first
  // client render matches SSR output — the real stored value (if any) is
  // read after mount, in the effect below, to avoid a hydration mismatch.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    // Only run on mount / when the key changes — reading storage on every
    // `initialValue` identity change would fight the setter below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Memoized setter
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue] as const;
}
