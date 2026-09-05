import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import MarketingPage from "./pages/MarketingPage.jsx";
import WorkspaceShell from "./features/workspace/WorkspaceShell.jsx";
import Overview from "./features/workspace/Overview.jsx";
import TasksPage from "./features/tasks/TasksPage.jsx";
import AssistantPage from "./features/assistant/AssistantPage.jsx";
import InsightsPage from "./features/insights/InsightsPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/app" element={<WorkspaceShell />}>
          <Route index element={<Overview />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="insights" element={<InsightsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}
