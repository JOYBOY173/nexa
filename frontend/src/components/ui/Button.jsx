import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-current text-white hover:bg-current-dark disabled:bg-current/50",
  secondary: "bg-transparent text-ink border border-border hover:border-ink/30 hover:bg-ink/[0.03]",
  ghost: "bg-transparent text-ink hover:bg-ink/[0.05]",
  danger: "bg-transparent text-danger border border-danger/30 hover:bg-danger-light",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

export default Button;
