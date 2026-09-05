import { createId } from "../lib/id.js";
import { todayKey, tomorrowKey, daysFromNowKey } from "../lib/dateUtils.js";

export const SCENARIOS = [
  { key: "professional", label: "Professional" },
  { key: "developer", label: "Developer" },
  { key: "freelancer", label: "Freelancer" },
  { key: "founder", label: "Founder" },
];

function task(scenario, title, priority, dueDate, completed = false) {
  return {
    id: createId("task"),
    title,
    priority,
    dueDate,
    completed,
    createdAt: new Date().toISOString(),
    scenario,
  };
}

/**
 * Builds a fresh set of default tasks for a scenario. Dates are generated
 * relative to "now" so the demo always feels current rather than showing
 * a stale hardcoded date.
 */
function buildDefaultTasks(scenario) {
  const today = todayKey();
  const tomorrow = tomorrowKey();
  const nextWeek = daysFromNowKey(6);

  const byScenario = {
    professional: [
      task(scenario, "Prepare quarterly presentation", "high", today, false),
      task(scenario, "Respond to priority emails", "high", today, false),
      task(scenario, "Review meeting notes", "medium", today, true),
      task(scenario, "Update project documentation", "medium", tomorrow, false),
      task(scenario, "Book travel for offsite", "low", nextWeek, false),
      task(scenario, "Reconcile monthly expense report", "low", tomorrow, true),
    ],
    developer: [
      task(scenario, "Fix authentication bug", "high", today, false),
      task(scenario, "Deploy staging build", "high", today, false),
      task(scenario, "Review pull request", "medium", today, false),
      task(scenario, "Update API documentation", "medium", tomorrow, true),
      task(scenario, "Write tests for billing module", "low", nextWeek, false),
      task(scenario, "Triage backlog issues", "low", tomorrow, false),
    ],
    freelancer: [
      task(scenario, "Send client proposal", "high", today, false),
      task(scenario, "Complete design revisions", "high", today, false),
      task(scenario, "Follow up with client", "medium", today, true),
      task(scenario, "Prepare project delivery", "medium", tomorrow, false),
      task(scenario, "Invoice last month's work", "low", nextWeek, false),
      task(scenario, "Update portfolio site", "low", nextWeek, false),
    ],
    founder: [
      task(scenario, "Prepare investor update", "high", today, false),
      task(scenario, "Review product metrics", "high", today, false),
      task(scenario, "Plan next sprint", "medium", today, true),
      task(scenario, "Review customer feedback", "medium", tomorrow, false),
      task(scenario, "Interview candidate for design role", "low", nextWeek, false),
      task(scenario, "Renew business insurance", "low", tomorrow, false),
    ],
  };

  return byScenario[scenario] ?? [];
}

/**
 * Deterministic demo history used to seed the productivity trend chart.
 * Represents completion rate (0-100) for the seven days prior to today.
 */
function buildDemoHistory(scenario) {
  const patterns = {
    professional: [52, 61, 58, 70, 66, 74, 69],
    developer: [45, 50, 62, 55, 68, 72, 65],
    freelancer: [40, 48, 53, 60, 57, 63, 71],
    founder: [58, 55, 64, 60, 72, 68, 75],
  };
  const values = patterns[scenario] ?? [50, 55, 60, 58, 62, 65, 63];
  return values.map((value, index) => ({
    dateKey: daysFromNowKey(index - 7),
    completionRate: value,
  }));
}

export function createDefaultScenarioState(scenario) {
  return {
    tasks: buildDefaultTasks(scenario),
    history: buildDemoHistory(scenario),
    plan: [],
    chatHistory: [],
  };
}

export function createDefaultWorkspace() {
  const scenarios = {};
  for (const { key } of SCENARIOS) {
    scenarios[key] = createDefaultScenarioState(key);
  }
  return {
    version: 1,
    activeScenario: "professional",
    scenarios,
  };
}
