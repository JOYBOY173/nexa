const INTEGRATIONS = ["Google Calendar", "Slack", "Notion", "Linear", "GitHub"];

export default function Integrations() {
  return (
    <section className="container-nexa py-20 sm:py-28">
      <div className="max-w-lg">
        <p className="mb-4 text-sm font-medium text-current-dark">Coming integrations</p>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Designed to fit into your existing tools.
        </h2>
        <p className="mt-4 text-muted">
          These integrations are part of the Nexa product concept and are not implemented in this
          portfolio demo.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {INTEGRATIONS.map((name) => (
          <span
            key={name}
            className="rounded-sm border border-dashed border-border bg-canvas px-4 py-2 text-sm text-muted"
          >
            {name} <span className="text-faint">· conceptual</span>
          </span>
        ))}
      </div>
    </section>
  );
}
