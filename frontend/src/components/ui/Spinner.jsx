export function ThinkingDots({ label = "Nexa is thinking" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted" role="status" aria-live="polite">
      <span className="font-medium text-current-dark">\u2726 {label}</span>
      <span className="flex items-center gap-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot1" />
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot2" />
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot3" />
      </span>
    </div>
  );
}
