import { useRef } from "react";

export default function Tabs({ items, active, onChange, ariaLabel }) {
  const buttonRefs = useRef([]);

  function handleKeyDown(e, index) {
    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = items.length - 1;
    else return;

    e.preventDefault();
    onChange(items[nextIndex].value);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 rounded-sm bg-ink/[0.04] p-1">
      {items.map((item, index) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            ref={(el) => (buttonRefs.current[index] = el)}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors
              ${isActive ? "bg-surface text-ink shadow-subtle" : "text-muted hover:text-ink"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
