export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

export function TextInput({ id, className = "", ...props }) {
  return (
    <input
      id={id}
      className={`w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint
        focus:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 ${className}`}
      {...props}
    />
  );
}

export function TextArea({ id, className = "", ...props }) {
  return (
    <textarea
      id={id}
      className={`w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint
        focus:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 ${className}`}
      {...props}
    />
  );
}

export function SegmentedControl({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={`rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors
              ${isActive ? "border-current bg-current-light text-current-dark" : "border-border text-muted hover:border-ink/30 hover:text-ink"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
