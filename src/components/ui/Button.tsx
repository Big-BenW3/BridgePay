import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold select-none disabled:opacity-40 disabled:pointer-events-none rounded-full",
  {
    variants: {
      variant: {
        primary: "bg-[#862fe7] text-white shadow-[0_0_0_1px_rgba(11,61,121,0.16)] hover:bg-[#7a2ad3] active:bg-[#6d20c7]",
        dark: "bg-[#111827] text-white hover:bg-[#1f2937] active:bg-[#0f141e]",
        ghost: "bg-transparent text-[#111827] border border-[#111827] hover:bg-[#f1f5f9] active:bg-[#e8eef5]",
        mint: "bg-[#d6fcf4] text-[#111827] border border-[#d8e0ea] hover:bg-[#b8f5e8] active:bg-[#a9efe0]",
        violet: "bg-[#ebdafd] text-[#5f259e] border border-[#d8e0ea] hover:bg-[#e0cefc] active:bg-[#d4bff9]",
      },
      size: {
        sm: "px-4 py-2 text-[14px] gap-1.5",
        md: "px-5 py-2.5 text-[15px] gap-2",
        lg: "px-7 py-3.5 text-[16px] gap-2",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, magnetic = false, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), magnetic && "btn-magnetic relative overflow-hidden", className)}
      {...props}
    >
      {children}
      {magnetic && children && (
        <span className="icon-wrapper w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center ml-1">
          →
        </span>
      )}
    </button>
  )
);
Button.displayName = "Button";