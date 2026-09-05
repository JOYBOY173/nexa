const STATS = [
  { value: "10K+", label: "tasks organized" },
  { value: "94%", label: "weekly goals completed" },
  { value: "4.9/5", label: "workspace satisfaction" },
];

const LOGOS = ["Northstar", "Vertex", "Frame", "Orbit", "Atlas"];

export default function SocialProof() {
  return (
    <section className="border-y border-border bg-surface/60 py-16">
      <div className="container-nexa">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Built for people who have a lot to get done.
            </h2>
            <p className="mt-3 max-w-md text-muted">
              From focused professionals to fast-moving founders, Nexa turns scattered work into a
              clear path forward.
            </p>
            <p className="mt-4 text-xs text-faint">
              Demo figures for this portfolio concept — not measured production data.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-ink sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-8">
          {LOGOS.map((name) => (
            <span key={name} className="text-sm font-medium tracking-wide text-faint">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
