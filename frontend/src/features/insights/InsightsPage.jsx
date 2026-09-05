import { useMemo } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { parseDateKey } from "../../lib/dateUtils.js";
import Card from "../../components/ui/Card.jsx";
import TrendChart from "./TrendChart.jsx";

function buildObservation(metrics, highShare) {
  if (metrics.total === 0) {
    return "Add a few tasks to start seeing insights about how you're working.";
  }
  if (highShare >= 0.4) {
    return "You're completing a solid percentage of your tasks, but your workload is becoming concentrated around a small number of high-priority items. Consider spreading new work more evenly.";
  }
  if (metrics.rate >= 75) {
    return "You're completing the large majority of what you plan. Your current workload looks sustainable.";
  }
  return "Your completion pace is steady. A quick prioritization pass could help you close out more of today's list.";
}

export default function InsightsPage() {
  const { tasks, metrics, history } = useWorkspace();

  const highShare = metrics.total === 0 ? 0 : metrics.highPriorityOpen / metrics.total;

  const trendPoints = useMemo(() => {
    const historical = (history ?? []).map((h) => {
      const date = parseDateKey(h.dateKey);
      return {
        label: date ? date.toLocaleDateString(undefined, { weekday: "short" }) : h.dateKey,
        value: h.completionRate,
      };
    });
    return [...historical, { label: "Today", value: metrics.rate }];
  }, [history, metrics.rate]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Insights</h1>
        <p className="mt-1 text-muted">A quick read on how your work is going.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Tasks Completed</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{metrics.completed}</p>
          <p className="mt-1 text-sm text-muted">of {metrics.total} total</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Completion Rate</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{metrics.rate}%</p>
          <p className="mt-1 text-sm text-muted">across this scenario</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Focus Score</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{metrics.focusScore}</p>
          <p className="mt-1 text-sm text-muted">a simple demo metric, not a validated measure</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink">Productivity Trend</h2>
        <p className="mt-1 text-sm text-muted">Combines demo history with today's live completion rate.</p>
        <div className="mt-4">
          <TrendChart points={trendPoints} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-faint">
          {trendPoints.map((p, i) => (
            <span key={i} className={i === trendPoints.length - 1 ? "font-medium text-current-dark" : ""}>
              {p.label}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink">Nexa Observation</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{buildObservation(metrics, highShare)}</p>
      </Card>
    </div>
  );
}
