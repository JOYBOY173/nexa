import { ListChecks, NotebookPen, CalendarClock, Gauge } from "lucide-react";

const PANELS = [
  { icon: ListChecks, label: "Tasks", detail: "3 open · 2 due today" },
  { icon: NotebookPen, label: "Notes", detail: "Meeting recap, ready to convert" },
  { icon: CalendarClock, label: "Plan", detail: "09:00–12:00 blocked" },
  { icon: Gauge, label: "Insights", detail: "Focus score: 78" },
];

export default function ProductIntro() {
  return (
    <section id="product" className="container-nexa py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <p className="mb-4 text-sm font-medium text-current-dark">One workspace</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your work, finally in one place.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Nexa brings your tasks, notes, plans, priorities, and insights into a single workspace,
            so you always know what deserves your attention — instead of piecing it together across
            five different tabs.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-3 shadow-card sm:p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PANELS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="rounded-md border border-border bg-canvas p-4">
                <Icon className="h-5 w-5 text-current" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink">{label}</p>
                <p className="mt-1 text-xs text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
