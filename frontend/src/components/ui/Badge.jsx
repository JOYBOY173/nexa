const PRIORITY_STYLES = {
  high: "bg-danger-light text-danger",
  medium: "bg-warn-light text-warn",
  low: "bg-current-light text-current-dark",
};

const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {PRIORITY_LABEL[priority] || "Medium"}
    </span>
  );
}

export default function Badge({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: "bg-ink/[0.05] text-muted",
    success: "bg-success-light text-success",
    current: "bg-current-light text-current-dark",
  };
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
