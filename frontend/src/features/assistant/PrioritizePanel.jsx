import { useEffect, useState } from "react";
import { ListOrdered, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAI } from "../../hooks/useAI.js";
import { prioritizeTasks } from "../../api/nexaApi.js";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { ThinkingDots } from "../../components/ui/Spinner.jsx";
import { PriorityBadge } from "../../components/ui/Badge.jsx";

export default function PrioritizePanel() {
  const { tasks, applyPrioritization, activeScenario } = useWorkspace();
  const { isLoading, status, error, run, reset } = useAI();
  const [recommendations, setRecommendations] = useState(null);
  const [applied, setApplied] = useState(false);

  // Recommendations reference specific task IDs — if the scenario changes
  // underneath us, those IDs no longer apply, so clear them.
  useEffect(() => {
    setRecommendations(null);
    setApplied(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenario]);

  const openTasks = tasks.filter((t) => !t.completed);

  async function handlePrioritize() {
    reset();
    setApplied(false);
    setRecommendations(null);
    const result = await run(() =>
      prioritizeTasks({
        tasks: openTasks.map((t) => ({ id: t.id, title: t.title, priority: t.priority, dueDate: t.dueDate })),
      })
    );
    if (result) setRecommendations(result);
  }

  function handleApply() {
    if (!recommendations) return;
    applyPrioritization(recommendations);
    setApplied(true);
  }

  function taskTitle(taskId) {
    return tasks.find((t) => t.id === taskId)?.title ?? "Unknown task";
  }

  if (openTasks.length === 0) {
    return (
      <EmptyState
        icon={ListOrdered}
        title="No open tasks to prioritize"
        description="Add a few tasks in My Tasks, then come back here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink">Prioritize Tasks</h2>
        <p className="mt-1 text-sm text-muted">
          Nexa will review your {openTasks.length} open task{openTasks.length === 1 ? "" : "s"} and
          suggest a priority order.
        </p>
        <Button className="mt-4" onClick={handlePrioritize} loading={isLoading}>
          Prioritize Tasks
        </Button>

        {!isLoading && status === "error" && (
          <div className="mt-4 flex flex-col items-start gap-2">
            <p className="text-sm text-danger">{error}</p>
            <Button size="sm" variant="secondary" onClick={handlePrioritize}>
              Try again
            </Button>
          </div>
        )}
      </Card>

      {isLoading && (
        <Card className="p-5">
          <ThinkingDots />
        </Card>
      )}

      {recommendations && recommendations.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Recommendations</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {recommendations.map((rec) => (
              <li key={rec.taskId} className="rounded-sm border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-ink">{taskTitle(rec.taskId)}</span>
                  <PriorityBadge priority={rec.priority} />
                </div>
                {rec.reason && <p className="mt-1.5 text-sm text-muted">{rec.reason}</p>}
              </li>
            ))}
          </ul>

          {applied ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Recommendations applied.
            </p>
          ) : (
            <Button className="mt-4" onClick={handleApply}>
              Apply recommendations
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
