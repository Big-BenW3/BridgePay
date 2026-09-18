"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  type?: "data" | "asymmetric" | "standard";
  delay?: number;
  revealOnScroll?: boolean;
}

/**
 * Animated Card Component
 * Supports three card types from Ventriloc design system:
 * - data: White background, 20px radius, for charts
 * - asymmetric: Ash background, 6px 0px 0px radius, featured content
 * - standard: Ash background, 8px radius, general cards
 */
export function AnimatedCard({
  children,
  className = "",
  type = "standard",
  delay = 0,
  revealOnScroll = true,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!revealOnScroll || prefersReducedMotion || !cardRef.current) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [revealOnScroll, prefersReducedMotion]);

  // Determine card class based on type
  const getCardClass = () => {
    switch (type) {
      case "data":
        return "data-card";
      case "asymmetric":
        return "asymmetric-card";
      case "standard":
      default:
        return "card";
    }
  };

  // Animation class
  const animationClass = prefersReducedMotion
    ? ""
    : isRevealed
    ? "animate-fade-in-up"
    : "opacity-0";

  return (
    <div
      ref={cardRef}
      className={`will-change-both ${getCardClass()} ${animationClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Data Dashboard Card for charts and stats
 * White background, 20px radius, NO SHADOW (Ventriloc rule)
 */
export function DataDashboardCard({
  children,
  className = "",
  delay = 0,
  revealOnScroll = true,
}: Omit<AnimatedCardProps, "type">) {
  return (
    <AnimatedCard
      type="data"
      className={className}
      delay={delay}
      revealOnScroll={revealOnScroll}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * Asymmetric Card for featured content
 * Ash background, 6px 0px 0px radius
 */
export function AsymmetricCard({
  children,
  className = "",
  delay = 0,
  revealOnScroll = true,
}: Omit<AnimatedCardProps, "type">) {
  return (
    <AnimatedCard
      type="asymmetric"
      className={className}
      delay={delay}
      revealOnScroll={revealOnScroll}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * Standard Card for general content
 * Ash background, 8px radius
 */
export function StandardCard({
  children,
  className = "",
  delay = 0,
  revealOnScroll = true,
}: Omit<AnimatedCardProps, "type">) {
  return (
    <AnimatedCard
      type="standard"
      className={className}
      delay={delay}
      revealOnScroll={revealOnScroll}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * Animated Chart Container
 * Handles SVG path drawing animation
 */
export function AnimatedChart({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`chart-container ${className}`}>
      {isMounted && children}
    </div>
  );
}

/**
 * Chart Line component with drawing animation
 */
export function ChartLine({
  d,
  stroke = "#ff682c",
  strokeWidth = 2,
  fill = "none",
  className = "",
  delay = 0,
  strokeDasharray,
  strokeDashoffset,
}: {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
  delay?: number;
  strokeDasharray?: string;
  strokeDashoffset?: string;
}) {
  const svgRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
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

  useEffect(() => {
    if (svgRef.current) {
      const length = svgRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [d]);

  if (prefersReducedMotion) {
    return (
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray || pathLength}
        strokeDashoffset={strokeDashoffset || pathLength}
        className={className}
      />
    );
  }

  return (
    <path
      ref={svgRef}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={strokeDasharray || pathLength}
      strokeDashoffset={pathLength}
      className={`chart-line ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

/**
 * Circular Progress Ring with animation
 */
export function ProgressRing({
  radius = 50,
  strokeWidth = 8,
  progress = 0, // 0-100
  stroke = "#ff682c",
  backgroundStroke = "#e8e8e8",
  className = "",
  delay = 0,
}: {
  radius?: number;
  strokeWidth?: number;
  progress?: number;
  stroke?: string;
  backgroundStroke?: string;
  className?: string;
  delay?: number;
}) {
  const diameter = radius * 2;
  const circumference = Math.PI * diameter;
  const offset = circumference - (progress / 100) * circumference;
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

  if (prefersReducedMotion) {
    return (
      <svg width={diameter} height={diameter} className={className}>
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke={backgroundStroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    );
  }

  return (
    <svg width={diameter} height={diameter} className={className}>
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        stroke={backgroundStroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius} ${radius})`}
        className="chart-circle"
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}
