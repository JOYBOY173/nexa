import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAI } from "../../hooks/useAI.js";
import { planMyDay } from "../../api/nexaApi.js";
import { formatTimeLabel, todayKey } from "../../lib/dateUtils.js";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { ThinkingDots } from "../../components/ui/Spinner.jsx";

export default function PlanDayPanel() {
  const { tasks, setPlan, plan, activeScenario } = useWorkspace();
  const { isLoading, status, error, run, reset } = useAI();
  const [draftPlan, setDraftPlan] = useState(null);
  const [added, setAdded] = useState(false);

  // Reset any stale draft when the scenario changes — a draft plan from a
  // different scenario's tasks shouldn't linger and reference stale IDs.
  useEffect(() => {
    setDraftPlan(null);
    setAdded(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenario]);

  // "Today's plan" should only pull in tasks that are actually relevant
  // today: due today, overdue, or undated — not tasks due next week.
  const today = todayKey();
  const todaysOpenTasks = tasks.filter((t) => !t.completed && (!t.dueDate || t.dueDate <= today));

  async function handlePlan() {
    reset();
    setAdded(false);
    setDraftPlan(null);
    const result = await run(() =>
      planMyDay({
        tasks: todaysOpenTasks.map((t) => ({ id: t.id, title: t.title, priority: t.priority, dueDate: t.dueDate })),
      })
    );
    if (result) setDraftPlan(result);
  }

  function handleAdd() {
    if (!draftPlan) return;
    setPlan(draftPlan);
    setAdded(true);
  }

  if (todaysOpenTasks.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Nothing to schedule yet"
        description="Add a few tasks in My Tasks, then plan your day."
      />
    );
  }

  const displayPlan = draftPlan ?? (added ? plan : null);

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink">Plan My Day</h2>
        <p className="mt-1 text-sm text-muted">
          Nexa will lay out a realistic local schedule from your {todaysOpenTasks.length} open task
          {todaysOpenTasks.length === 1 ? "" : "s"}. This plan stays in Nexa — it isn't synced to any
          external calendar.
        </p>
        <Button className="mt-4" onClick={handlePlan} loading={isLoading}>
          Plan My Day
        </Button>

        {!isLoading && status === "error" && (
          <div className="mt-4 flex flex-col items-start gap-2">
            <p className="text-sm text-danger">{error}</p>
            <Button size="sm" variant="secondary" onClick={handlePlan}>
              Try again
            </Button>
          </div>
        )}
      </Card>

      {isLoading && (
        <Card className="p-5">
          <ThinkingDots label="Nexa is planning" />
        </Card>
      )}

      {displayPlan && displayPlan.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Today's schedule</h3>
          <ul className="mt-3 flex flex-col divide-y divide-border">
            {displayPlan.map((block, i) => (
              <li key={i} className="flex items-center gap-4 py-2.5">
                <span className="w-32 shrink-0 text-xs font-medium text-muted">
                  {formatTimeLabel(block.start)} – {formatTimeLabel(block.end)}
                </span>
                <span className="text-sm text-ink">{block.title}</span>
              </li>
            ))}
          </ul>

          {draftPlan && !added && (
            <Button className="mt-4" onClick={handleAdd}>
              Add to today's plan
            </Button>
          )}
          {added && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Added to today's plan.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
