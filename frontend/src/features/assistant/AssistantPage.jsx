import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Tabs from "../../components/ui/Tabs.jsx";
import ChatPanel from "./ChatPanel.jsx";
import PrioritizePanel from "./PrioritizePanel.jsx";
import PlanDayPanel from "./PlanDayPanel.jsx";
import NotesToTasksPanel from "./NotesToTasksPanel.jsx";

const TOOLS = [
  { value: "chat", label: "Chat" },
  { value: "prioritize", label: "Prioritize" },
  { value: "plan", label: "Plan My Day" },
  { value: "notes", label: "Notes \u2192 Tasks" },
];

const VALID_TOOLS = new Set(TOOLS.map((t) => t.value));

export default function AssistantPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTool = searchParams.get("tool");
  const [activeTool, setActiveTool] = useState(VALID_TOOLS.has(initialTool) ? initialTool : "chat");

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool && VALID_TOOLS.has(tool) && tool !== activeTool) {
      setActiveTool(tool);
    }
    // Only react to external navigation (e.g. Quick Actions), not our own tab clicks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleChange(tool) {
    setActiveTool(tool);
    setSearchParams(tool === "chat" ? {} : { tool }, { replace: true });
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Ask Nexa</h1>
        <p className="mt-1 text-muted">Your workspace, with an intelligent second brain.</p>
      </div>

      <Tabs items={TOOLS} active={activeTool} onChange={handleChange} ariaLabel="AI assistant tools" />

      <div>
        {activeTool === "chat" && <ChatPanel />}
        {activeTool === "prioritize" && <PrioritizePanel />}
        {activeTool === "plan" && <PlanDayPanel />}
        {activeTool === "notes" && <NotesToTasksPanel />}
      </div>
    </div>
  );
}
