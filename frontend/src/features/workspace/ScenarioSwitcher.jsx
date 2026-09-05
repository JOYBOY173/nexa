import { useWorkspace } from "../../context/WorkspaceContext.jsx";

export default function ScenarioSwitcher({ className = "" }) {
  const { scenarios, activeScenario, switchScenario } = useWorkspace();

  return (
    <div className={className}>
      <label htmlFor="scenario-select" className="sr-only">
        Demo scenario
      </label>
      <select
        id="scenario-select"
        value={activeScenario}
        onChange={(e) => switchScenario(e.target.value)}
        className="rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink
          focus:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30"
      >
        {scenarios.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label} scenario
          </option>
        ))}
      </select>
    </div>
  );
}
