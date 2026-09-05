import { NavLink } from "react-router-dom";
import { LayoutGrid, ListChecks, Sparkles, BarChart3 } from "lucide-react";

const NAV_ITEMS = [
  { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/assistant", label: "Assistant", icon: Sparkles },
  { to: "/app/insights", label: "Insights", icon: BarChart3 },
];

export default function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Workspace"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors
            ${isActive ? "text-current-dark" : "text-faint"}`
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
