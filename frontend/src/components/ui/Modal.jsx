import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, labelledBy }) {
  const dialogRef = useRef(null);
  const titleId = labelledBy || "modal-title";

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    const dialogNode = dialogRef.current;
    const focusable = dialogNode?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-t-lg sm:rounded-lg border border-border bg-surface p-6 shadow-raised animate-fade-up max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-sm p-1 text-muted hover:bg-ink/[0.05] hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
