import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface ScrollRevealState {
  isVisible: boolean;
  hasAnimated: boolean;
  progress: number;
}

export function useScrollReveal({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  delay = 0,
}: UseScrollRevealOptions = {}): [React.RefObject<HTMLDivElement>, ScrollRevealState] {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollRevealState>({
    isVisible: false,
    hasAnimated: false,
    progress: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          const progress = Math.min(Math.max(entry.intersectionRatio, 0), 1);

          if (isVisible && !state.hasAnimated) {
            setTimeout(() => {
              setState({
                isVisible: true,
                hasAnimated: true,
                progress,
              });
            }, delay);
          } else if (!triggerOnce) {
            setState((prev) => ({
              ...prev,
              isVisible,
              progress,
            }));
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, state.hasAnimated]);

  return [ref, state];
}

// Hook for staggered children animations
export function useStaggeredReveal(
  itemCount: number,
  baseDelay: number = 100
): { getDelay: (index: number) => number; containerRef: React.RefObject<HTMLDivElement>; isVisible: boolean } {
  const [containerRef, { isVisible }] = useScrollReveal({ threshold: 0.1 });
  
  const getDelay = useCallback(
    (index: number) => (isVisible ? index * baseDelay : 0),
    [isVisible, baseDelay]
  );

  return { getDelay, containerRef, isVisible };
}

// Hook for parallax scroll effect
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      setOffset(distance * speed * -1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
}

// Hook for scroll progress within element bounds
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is visible
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      
      if (elementTop > windowHeight) {
        setProgress(0);
      } else if (elementBottom < 0) {
        setProgress(1);
      } else {
        const visibleHeight = Math.min(windowHeight, elementBottom) - Math.max(0, elementTop);
        const totalHeight = rect.height;
        setProgress(Math.min(1, visibleHeight / Math.min(totalHeight, windowHeight)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, progress };
}
