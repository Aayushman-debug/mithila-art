import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage.
 * Works like useState but reads/writes to localStorage under the given key.
 *
 * @param {string} key — localStorage key
 * @param {*} initialValue — default value if nothing is stored
 * @returns {[*, Function, Function]} — [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initialiser — read from storage only once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      console.warn(`useLocalStorage: could not read key "${key}"`);
      return initialValue;
    }
  });

  // Write to localStorage whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(`useLocalStorage: could not write key "${key}"`);
    }
  }, [key, storedValue]);

  /**
   * Update the stored value. Accepts a value or an updater function
   * (same API as React's setState).
   */
  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = typeof value === 'function' ? value(prev) : value;
        return nextValue;
      });
    },
    [key],
  );

  /**
   * Remove the key from localStorage and reset to initial value.
   */
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`useLocalStorage: could not remove key "${key}"`);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
