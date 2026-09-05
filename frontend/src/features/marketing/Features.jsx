import { Layers, Target, Play, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Bring the chaos together.",
    label: "Organize",
    description:
      "Scattered tasks, notes, plans, and information finally live in one calm, structured workspace.",
  },
  {
    icon: Target,
    title: "Know what matters now.",
    label: "Prioritize",
    description:
      "Nexa looks at what's on your plate and helps surface what actually deserves your attention today.",
  },
  {
    icon: Play,
    title: "Turn plans into progress.",
    label: "Execute",
    description:
      "Move from intention to action with a day plan and task flow built for getting things done.",
  },
  {
    icon: TrendingUp,
    title: "Understand how you're working.",
    label: "Perform",
    description:
      "See your completion trends and workload balance so you can adjust before you burn out.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-border bg-surface/60 py-20 sm:py-28">
      <div className="container-nexa">
        <div className="max-w-lg">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Four pillars. One clear workflow.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, label, description }) => (
            <div key={label} className="rounded-md border border-border bg-canvas p-6">
              <Icon className="h-6 w-6 text-current" aria-hidden="true" />
              <p className="mt-4 text-xs font-medium text-current-dark">{label}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
