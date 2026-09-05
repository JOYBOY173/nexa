import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { ThinkingDots } from "../../components/ui/Spinner.jsx";
import { useAI } from "../../hooks/useAI.js";
import { askNexa } from "../../api/nexaApi.js";

const DEMO_CONTEXT = {
  scenario: "developer",
  tasks: [
    { id: "demo_1", title: "Fix authentication bug", priority: "high", dueDate: "today", completed: false },
    { id: "demo_2", title: "Review pull request", priority: "medium", dueDate: "today", completed: false },
    { id: "demo_3", title: "Update API documentation", priority: "medium", dueDate: "tomorrow", completed: true },
  ],
};

export default function AIDemo() {
  const [reply, setReply] = useState(null);
  const { isLoading, status, error, run } = useAI();

  async function handleAsk() {
    setReply(null);
    const result = await run(() =>
      askNexa({ message: "What should I focus on today?", context: DEMO_CONTEXT })
    );
    if (result) setReply(result);
  }

  return (
    <section className="border-y border-border bg-surface/60 py-20 sm:py-28">
      <div className="container-nexa grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="mb-4 text-sm font-medium text-current-dark">Meet your AI workspace</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Don't just plan your work. Let Nexa think alongside you.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Ask a real question and Nexa will reason over a small sample workspace — the same way it
            reasons over yours inside the app.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-canvas p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Ask Nexa</p>
            <span className="text-xs text-faint">Sample: developer scenario</span>
          </div>

          <div className="rounded-sm bg-surface px-3 py-2 text-sm text-ink shadow-subtle">
            What should I focus on today?
          </div>

          <div className="mt-4 min-h-[64px]">
            {isLoading && <ThinkingDots />}
            {!isLoading && status === "error" && (
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-danger">{error || "Nexa couldn't complete that request."}</p>
                <Button size="sm" variant="secondary" onClick={handleAsk}>
                  Try again
                </Button>
              </div>
            )}
            {!isLoading && reply && (
              <p className="flex items-start gap-2 rounded-sm border border-current/20 bg-current-light px-3 py-2.5 text-sm text-current-dark animate-fade-in">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{reply}</span>
              </p>
            )}
          </div>

          {!reply && !isLoading && status !== "error" && (
            <Button className="mt-2" onClick={handleAsk}>
              Ask Nexa
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
