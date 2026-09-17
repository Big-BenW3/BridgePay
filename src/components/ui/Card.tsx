import { forwardRef } from "react";
import { clsx } from "clsx";

export const Card = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties }>(
  ({ children, className, hover = true, style }, ref) => (
    <div ref={ref} className={clsx("double-bezel", hover && "hover", className)} style={style}>
      <div className="core p-6">{children}</div>
    </div>
  )
);
Card.displayName = "Card";

export const FeatureCard = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties }>(
  ({ children, className, hover = true, style }, ref) => (
    <div ref={ref} className={clsx("double-bezel", hover && "hover", className)} style={style}>
      <div className="core p-8">{children}</div>
    </div>
  )
);
FeatureCard.displayName = "FeatureCard";

export const BentoCard = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string; span?: string; style?: React.CSSProperties }>(
  ({ children, className, span, style }, ref) => (
    <div ref={ref} className={clsx("double-bezel", className)} style={{ gridColumn: span ?? "span 6 / span 6", ...style }}>
      <div className="core p-6">{children}</div>
    </div>
  )
);
BentoCard.displayName = "BentoCard";