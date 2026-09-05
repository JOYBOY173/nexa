import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { PriorityBadge } from "../../components/ui/Badge.jsx";
import { formatDueDate } from "../../lib/dateUtils.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

const PRIORITY_ORDER = ["high", "medium", "low"];

export default function TaskRow({ task }) {
  const { toggleTaskCompletion, deleteTask, updateTaskPriority } = useWorkspace();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function cyclePriority() {
    const nextIndex = (PRIORITY_ORDER.indexOf(task.priority) + 1) % PRIORITY_ORDER.length;
    updateTaskPriority(task.id, PRIORITY_ORDER[nextIndex]);
  }

  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <button
        onClick={() => toggleTaskCompletion(task.id)}
        aria-pressed={task.completed}
        aria-label={task.completed ? `Mark "${task.title}" as not completed` : `Mark "${task.title}" as completed`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors
          ${task.completed ? "border-current bg-current text-white" : "border-border hover:border-current"}`}
      >
        {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <span className={`min-w-0 flex-1 truncate text-sm ${task.completed ? "text-faint line-through" : "text-ink"}`}>
        {task.title}
      </span>

      <button
        onClick={cyclePriority}
        aria-label={`Change priority, currently ${task.priority}`}
        className="shrink-0 rounded-sm transition-transform hover:scale-105"
      >
        <PriorityBadge priority={task.priority} />
      </button>

      <span className="hidden w-24 shrink-0 text-right text-xs text-muted sm:block">
        {formatDueDate(task.dueDate)}
      </span>

      {confirmingDelete ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => deleteTask(task.id)}
            className="rounded-sm px-2 py-1 text-xs font-medium text-danger hover:bg-danger-light"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="rounded-sm px-2 py-1 text-xs font-medium text-muted hover:bg-ink/[0.05]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmingDelete(true)}
          aria-label={`Delete "${task.title}"`}
          className="shrink-0 rounded-sm p-1.5 text-faint hover:bg-danger-light hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
