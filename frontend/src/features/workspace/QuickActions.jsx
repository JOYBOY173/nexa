import { useNavigate } from "react-router-dom";
import { ListOrdered, CalendarClock, NotebookPen, MessageCircle } from "lucide-react";

const ACTIONS = [
  {
    key: "prioritize",
    label: "Prioritize Tasks",
    description: "Let Nexa rank what matters most.",
    icon: ListOrdered,
  },
  {
    key: "plan",
    label: "Plan My Day",
    description: "Turn today's tasks into a schedule.",
    icon: CalendarClock,
  },
  {
    key: "notes",
    label: "Turn Notes Into Tasks",
    description: "Paste messy notes, get structured tasks.",
    icon: NotebookPen,
  },
  {
    key: "chat",
    label: "Ask Nexa",
    description: "Open the AI assistant.",
    icon: MessageCircle,
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ key, label, description, icon: Icon }) => (
        <button
          key={key}
          onClick={() => navigate(`/app/assistant?tool=${key}`)}
          className="flex flex-col items-start gap-2 rounded-md border border-border bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <Icon className="h-5 w-5 text-current" aria-hidden="true" />
          <span className="text-sm font-medium text-ink">{label}</span>
          <span className="text-xs text-muted">{description}</span>
        </button>
      ))}
    </div>
  );
}
