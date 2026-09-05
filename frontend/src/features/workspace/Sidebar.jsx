import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutGrid, ListChecks, Sparkles, BarChart3, RotateCcw, ArrowLeft } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import Logo from "../marketing/Logo.jsx";
import ConfirmResetDialog from "./ConfirmResetDialog.jsx";

const NAV_ITEMS = [
  { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/app/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/app/insights", label: "Insights", icon: BarChart3 },
];

export default function Sidebar() {
  const { ownerFullName, resetWorkspace } = useWorkspace();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Workspace">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors
              ${isActive ? "bg-current-light text-current-dark" : "text-muted hover:bg-ink/[0.04] hover:text-ink"}`
            }
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            {label}
          </NavLink>
        ))}

        <Link
          to="/"
          className="mt-2 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
          Back to site
        </Link>
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={() => setConfirmOpen(true)}
          className="mb-4 flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted hover:bg-ink/[0.04] hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset Demo Workspace
        </button>
        <div className="px-3">
          <p className="text-sm font-medium text-ink">{ownerFullName}</p>
          <p className="text-xs text-faint">Demo Workspace</p>
        </div>
      </div>

      <ConfirmResetDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          resetWorkspace();
          setConfirmOpen(false);
        }}
      />
    </aside>
  );
}
