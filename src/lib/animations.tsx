"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Hook for scroll-triggered animations using Intersection Observer
 */
export function useScrollReveal(
  threshold: number = 0.1,
  rootMargin: string = "0px"
): [
  (node: Element | null) => void,
  boolean
] {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            // Optionally unobserve after reveal for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return [
    (node: Element | null) => {
      ref.current = node;
    },
    isRevealed,
  ];
}

/**
 * Hook for staggered animations on child elements
 */
export function useStaggerReveal(
  delayStep: number = 100,
  threshold: number = 0.1
): [
  (node: Element | null) => void,
  (index: number) => boolean
] {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children);
            children.forEach((child, index) => {
              setTimeout(() => {
                setRevealedIndices((prev) => new Set(prev).add(index));
              }, index * delayStep);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [delayStep, threshold]);

  return [
    (node: Element | null) => {
      containerRef.current = node;
    },
    (index: number) => revealedIndices.has(index),
  ];
}

/**
 * Hook for animating numbers (counter effect)
 */
export function useAnimatedCounter(
  endValue: number,
  duration: number = 1000,
  startValue: number = 0
): number {
  const [currentValue, setCurrentValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOutCubic;

      setCurrentValue(Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    if (isAnimating) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [endValue, duration, startValue, isAnimating]);

  // Start animation when component mounts or endValue changes
  useEffect(() => {
    setIsAnimating(true);
    startTimeRef.current = null;
    setCurrentValue(startValue);
  }, [endValue, startValue]);

  return currentValue;
}

/**
 * Hook for detecting if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Component for animated div with scroll reveal
 */
export function AnimatedDiv({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const [ref, isRevealed] = useScrollReveal(threshold);
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isRevealed ? "revealed" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Component for staggered animation of children
 */
export function StaggerContainer({
  children,
  className = "",
  delayStep = 100,
  threshold = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delayStep?: number;
  threshold?: number;
}) {
  const [containerRef] = useStaggerReveal(delayStep, threshold);
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`stagger-children ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Utility to format numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Utility to truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
