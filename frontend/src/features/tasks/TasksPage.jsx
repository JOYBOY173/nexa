import { useMemo, useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { todayKey } from "../../lib/dateUtils.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import TaskRow from "./TaskRow.jsx";
import TaskFilters from "./TaskFilters.jsx";
import AddTaskModal from "./AddTaskModal.jsx";

export default function TasksPage() {
  const { tasks } = useWorkspace();
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    const today = todayKey();
    switch (filter) {
      case "today":
        return tasks.filter((t) => t.dueDate === today && !t.completed);
      case "upcoming":
        return tasks.filter((t) => t.dueDate && t.dueDate > today && !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Keep a stable, sensible ordering: incomplete first, then by priority.
  const sortedTasks = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    return [...filteredTasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityRank[a.priority] - priorityRank[b.priority];
    });
  }, [filteredTasks]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">My Tasks</h1>
          <p className="mt-1 text-muted">Everything you need to get done.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Task
        </Button>
      </div>

      <TaskFilters active={filter} onChange={setFilter} />

      <Card className="p-2 sm:p-4">
        {sortedTasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No tasks yet."
            description="Add your first task to get started."
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                Add Task
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col">
            {sortedTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </Card>

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
