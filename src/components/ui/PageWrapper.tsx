"use client";

import Link from "next/link";
import { useReducedMotion } from "@/lib/animations";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  backLink?: { href: string; text: string };
  showAnimations?: boolean;
}

/**
 * PageWrapper - Applies consistent Ventriloc design system to all pages
 * Handles animations, typography, and layout consistently
 */
export function PageWrapper({
  children,
  className = "",
  title,
  subtitle,
  backLink,
  showAnimations = true,
}: PageWrapperProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion && showAnimations;

  return (
    <div className={`min-h-screen bg-[var(--surface-page-canvas)] ${className}`}>
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Back link */}
        {backLink && (
          <Link
            href={backLink.href}
            className="link-ember font-polysans text-[13px] mb-8 block w-fit"
          >
            {backLink.text}
          </Link>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <header className="mb-10">
            {title && (
              <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] responsive-heading-lg">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-3 text-[18px] leading-[1.25] text-[var(--color-steel)] max-w-[640px]">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {/* Content */}
        <main className={shouldAnimate ? "animate-fade-in" : ""}>{children}</main>
      </div>
    </div>
  );
}

/**
 * SectionWrapper - For consistent section styling
 */
export function SectionWrapper({
  children,
  className = "",
  title,
  subtitle,
  variant = "default", // "default" | "ash" | "ivory"
  showAnimations = true,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: "default" | "ash" | "ivory";
  showAnimations?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion && showAnimations;

  const variantClasses = {
    default: "",
    ash: "section-ash",
    ivory: "section-ivory",
  };

  return (
    <section
      className={`py-10 ${variantClasses[variant]} ${className}`}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="font-polysans text-[32px] leading-[1.19] tracking-[-0.64px] text-[var(--color-graphite)] responsive-heading">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-[16px] leading-[1.25] text-[var(--color-steel)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={shouldAnimate ? "animate-fade-in-up" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * CardWrapper - For consistent card styling
 */
export function CardWrapper({
  children,
  className = "",
  type = "standard", // "standard" | "data" | "asymmetric"
  showAnimations = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "standard" | "data" | "asymmetric";
  showAnimations?: boolean;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion && showAnimations;

  const typeClasses = {
    standard: "card",
    data: "data-card",
    asymmetric: "asymmetric-card",
  };

  return (
    <div
      className={`will-change-both ${typeClasses[type]} ${className}`}
      style={{
        animationDelay: shouldAnimate ? `${delay}ms` : undefined,
      }}
    >
      {shouldAnimate ? (
        <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * StatCard - For displaying stats with consistent styling
 */
export function StatCard({
  value,
  label,
  subtitle,
  className = "",
  delay = 0,
}: {
  value: string | number;
  label: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <CardWrapper type="data" className={`p-6 ${className}`} delay={delay}>
      <p className="font-polysans text-[44px] leading-[0.91] tracking-[-0.88px] text-[var(--color-graphite)] font-medium">
        {value}
      </p>
      <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] mt-1">
        {label}
      </p>
      {subtitle && (
        <p className="text-[14px] text-[var(--color-steel)] mt-2">{subtitle}</p>
      )}
    </CardWrapper>
  );
}

// Re-export from animations for convenience
export {
  useScrollReveal,
  useStaggerReveal,
  useAnimatedCounter,
  useReducedMotion,
} from "@/lib/animations";
