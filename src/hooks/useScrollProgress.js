import { useState, useEffect } from 'react';

/**
 * Custom hook that returns the current page scroll progress as a value
 * between 0 (top) and 1 (bottom).
 *
 * @returns {number} scrollProgress — 0 to 1
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      setScrollProgress(progress);
    }

    // Set initial value
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollProgress;
}

export default useScrollProgress;
