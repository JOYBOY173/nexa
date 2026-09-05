import { useNavigate } from "react-router-dom";
import { Check, ListChecks, Sparkles } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getGreeting } from "../../lib/dateUtils.js";
import { PriorityBadge } from "../../components/ui/Badge.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import QuickActions from "./QuickActions.jsx";

function buildInsight(metrics) {
  if (metrics.total === 0) {
    return "Add a task to get your first insight from Nexa.";
  }
  if (metrics.highPriorityOpen >= 2) {
    return `Your workload is concentrated around ${metrics.highPriorityOpen} high-priority tasks today. Consider clearing those before moving to lower-priority work.`;
  }
  if (metrics.rate >= 70) {
    return "You're making strong progress today. Keep the momentum going on what's left.";
  }
  return "Your day is manageable so far. A quick prioritization pass could help you sequence what's left.";
}

export default function Overview() {
  const { ownerName, metrics, toggleTaskCompletion } = useWorkspace();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{getGreeting(ownerName)} 👋</h1>
        <p className="mt-1 text-muted">Here's what deserves your attention today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Today's Focus</h2>
          {metrics.todaysTasks.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={ListChecks}
                title="Nothing due today"
                description="Add a task or check the Upcoming filter in My Tasks."
              />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-1">
              {metrics.todaysTasks.map((task) => (
                <li key={task.id}>
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex w-full items-center gap-3 rounded-sm px-2 py-2.5 text-left transition-colors hover:bg-ink/[0.03]"
                    aria-pressed={task.completed}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors
                        ${task.completed ? "border-current bg-current text-white" : "border-border"}`}
                    >
                      {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className={`flex-1 text-sm ${task.completed ? "text-faint line-through" : "text-ink"}`}>
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Progress</h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-semibold text-ink">
              {metrics.completed} / {metrics.total}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
            <div
              className="h-full rounded-full bg-current transition-all duration-500"
              style={{ width: `${metrics.rate}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted">{metrics.rate}%</p>
          <p className="mt-3 text-sm text-muted">
            {metrics.rate >= 60
              ? "You're making solid progress today."
              : "There's still time to make progress today."}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-current-light text-current-dark">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-ink">Nexa Insight</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{buildInsight(metrics)}</p>
            <Button size="sm" className="mt-4" onClick={() => navigate("/app/assistant?tool=prioritize")}>
              Prioritize tasks
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Quick actions</h2>
        <QuickActions />
      </div>
    </div>
  );
}
