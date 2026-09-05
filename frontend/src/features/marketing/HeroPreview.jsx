import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

const INITIAL_ITEMS = [
  { id: 1, title: "Fix authentication bug", priority: "high", done: false },
  { id: 2, title: "Review pull request", priority: "medium", done: false },
  { id: 3, title: "Update API documentation", priority: "medium", done: true },
];

const PRIORITY_DOT = { high: "bg-danger", medium: "bg-warn", low: "bg-current" };

/** A small, genuinely interactive preview of the workspace — not a static
 * screenshot. Local-only state; it doesn't touch the real app data. */
export default function HeroPreview() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const completed = items.filter((i) => i.done).length;
  const percent = Math.round((completed / items.length) * 100);

  function toggle(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  return (
    <div className="relative">
      <div className="absolute -inset-x-3 -inset-y-3 -z-10 rounded-lg bg-current/[0.06]" aria-hidden="true" />
      <div className="rounded-lg border border-border bg-surface p-5 shadow-raised sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-faint">Today's focus</p>
            <p className="text-sm text-muted">3 tasks · developer scenario</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-semibold text-ink">{percent}%</span>
            <span className="text-xs text-muted">{completed} of {items.length} done</span>
          </div>
        </div>

        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full bg-current transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="mb-5 flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-ink/[0.03]"
                aria-pressed={item.done}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors
                    ${item.done ? "border-current bg-current text-white" : "border-border"}`}
                >
                  {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={`flex-1 text-sm ${item.done ? "text-faint line-through" : "text-ink"}`}>
                  {item.title}
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[item.priority]}`} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-sm border border-current/20 bg-current-light px-3 py-2.5">
          <p className="flex items-start gap-2 text-sm text-current-dark">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Two high-priority tasks are open. Clear those first for the biggest impact today.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
