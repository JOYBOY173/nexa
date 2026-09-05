import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { createDefaultWorkspace, createDefaultScenarioState, SCENARIOS } from "../data/scenarios.js";
import { createId } from "../lib/id.js";
import { todayKey, tomorrowKey } from "../lib/dateUtils.js";

const STORAGE_KEY = "nexa-workspace";
const OWNER_FIRST_NAME = "Joshua";
const OWNER_FULL_NAME = "Joshua Olushina";

const WorkspaceContext = createContext(null);

/** Confirms a loaded payload roughly matches the shape we expect. Anything
 * short of that and we fall back to safe defaults rather than crash. */
function isValidWorkspace(data) {
  if (!data || typeof data !== "object") return false;
  if (typeof data.activeScenario !== "string") return false;
  if (!data.scenarios || typeof data.scenarios !== "object") return false;
  return SCENARIOS.every(({ key }) => Array.isArray(data.scenarios[key]?.tasks));
}

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace, hardReset] = useLocalStorage(STORAGE_KEY, createDefaultWorkspace());

  // Self-heal on read: if a previous write left a malformed shape (or a
  // future version bumped structure), quietly repair it instead of
  // breaking the UI.
  const safeWorkspace = useMemo(() => {
    if (isValidWorkspace(workspace)) return workspace;
    return createDefaultWorkspace();
  }, [workspace]);

  const activeScenario = safeWorkspace.activeScenario;
  const scenarioState = safeWorkspace.scenarios[activeScenario] ?? createDefaultScenarioState(activeScenario);
  const tasks = scenarioState.tasks ?? [];

  const updateScenarioState = useCallback(
    (updater) => {
      setWorkspace((prev) => {
        const base = isValidWorkspace(prev) ? prev : createDefaultWorkspace();
        const currentScenarioState =
          base.scenarios[base.activeScenario] ?? createDefaultScenarioState(base.activeScenario);
        const nextScenarioState = updater(currentScenarioState);
        return {
          ...base,
          scenarios: {
            ...base.scenarios,
            [base.activeScenario]: nextScenarioState,
          },
        };
      });
    },
    [setWorkspace]
  );

  const switchScenario = useCallback(
    (scenarioKey) => {
      setWorkspace((prev) => {
        const base = isValidWorkspace(prev) ? prev : createDefaultWorkspace();
        return { ...base, activeScenario: scenarioKey };
      });
    },
    [setWorkspace]
  );

  const addTask = useCallback(
    ({ title, priority = "medium", dueDate = null }) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      updateScenarioState((state) => ({
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: createId("task"),
            title: trimmed,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
            scenario: activeScenario,
          },
        ],
      }));
    },
    [updateScenarioState, activeScenario]
  );

  const addTasks = useCallback(
    (newTasks) => {
      updateScenarioState((state) => ({
        ...state,
        tasks: [
          ...state.tasks,
          ...newTasks.map((t) => ({
            id: createId("task"),
            title: t.title,
            priority: t.priority ?? "medium",
            dueDate: t.dueDate ?? null,
            completed: false,
            createdAt: new Date().toISOString(),
            scenario: activeScenario,
          })),
        ],
      }));
    },
    [updateScenarioState, activeScenario]
  );

  const toggleTaskCompletion = useCallback(
    (taskId) => {
      updateScenarioState((state) => ({
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      }));
    },
    [updateScenarioState]
  );

  const deleteTask = useCallback(
    (taskId) => {
      updateScenarioState((state) => ({
        ...state,
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    },
    [updateScenarioState]
  );

  const updateTaskPriority = useCallback(
    (taskId, priority) => {
      updateScenarioState((state) => ({
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, priority } : t)),
      }));
    },
    [updateScenarioState]
  );

  const updateTaskDueDate = useCallback(
    (taskId, dueDate) => {
      updateScenarioState((state) => ({
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, dueDate } : t)),
      }));
    },
    [updateScenarioState]
  );

  /** Applies AI prioritization recommendations, but only for task IDs that
   * genuinely exist in the current scenario — the AI never gets to touch
   * state directly. */
  const applyPrioritization = useCallback(
    (recommendations) => {
      const validIds = new Set(tasks.map((t) => t.id));
      const safeRecs = recommendations.filter((r) => validIds.has(r.taskId));
      updateScenarioState((state) => ({
        ...state,
        tasks: state.tasks.map((t) => {
          const match = safeRecs.find((r) => r.taskId === t.id);
          return match ? { ...t, priority: match.priority } : t;
        }),
      }));
      return safeRecs.length;
    },
    [tasks, updateScenarioState]
  );

  const setPlan = useCallback(
    (plan) => {
      updateScenarioState((state) => ({ ...state, plan }));
    },
    [updateScenarioState]
  );

  const appendChatMessage = useCallback(
    (message) => {
      updateScenarioState((state) => ({
        ...state,
        chatHistory: [...(state.chatHistory ?? []), message],
      }));
    },
    [updateScenarioState]
  );

  const resetWorkspace = useCallback(() => {
    hardReset(createDefaultWorkspace());
  }, [hardReset]);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const today = todayKey();
    const todaysTasks = tasks.filter((t) => t.dueDate === today);
    const highPriorityOpen = tasks.filter((t) => !t.completed && t.priority === "high").length;

    // Deterministic, transparent "Focus Score": rewards completion rate and
    // penalizes an excess of open high-priority items. Explicitly not a
    // scientifically validated metric — just a simple, explainable demo score.
    const focusScore = Math.max(
      0,
      Math.min(100, Math.round(rate * 0.7 + (total === 0 ? 0 : (1 - highPriorityOpen / Math.max(total, 1)) * 30)))
    );

    return { total, completed, rate, todaysTasks, highPriorityOpen, focusScore };
  }, [tasks]);

  const value = useMemo(
    () => ({
      ownerName: OWNER_FIRST_NAME,
      ownerFullName: OWNER_FULL_NAME,
      activeScenario,
      scenarios: SCENARIOS,
      tasks,
      plan: scenarioState.plan ?? [],
      chatHistory: scenarioState.chatHistory ?? [],
      history: scenarioState.history ?? [],
      metrics,
      switchScenario,
      addTask,
      addTasks,
      toggleTaskCompletion,
      deleteTask,
      updateTaskPriority,
      updateTaskDueDate,
      applyPrioritization,
      setPlan,
      appendChatMessage,
      resetWorkspace,
      todayKey: todayKey(),
      tomorrowKey: tomorrowKey(),
    }),
    [
      activeScenario,
      tasks,
      scenarioState.plan,
      scenarioState.chatHistory,
      scenarioState.history,
      metrics,
      switchScenario,
      addTask,
      addTasks,
      toggleTaskCompletion,
      deleteTask,
      updateTaskPriority,
      updateTaskDueDate,
      applyPrioritization,
      setPlan,
      appendChatMessage,
      resetWorkspace,
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
