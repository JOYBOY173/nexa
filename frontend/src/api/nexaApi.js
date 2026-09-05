// Centralized API layer. Every AI call goes through here so components never
// scatter raw fetch() calls or duplicate error/timeout handling.

const API_BASE_URL = import.meta.env.VITE_NEXA_API_BASE_URL || "http://localhost:8787";
const DEFAULT_TIMEOUT_MS = 20000;

class NexaApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "NexaApiError";
    this.status = status;
    this.code = code;
  }
}

async function postJson(path, body, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      throw new NexaApiError("The request took too long to respond.", { code: "timeout" });
    }
    throw new NexaApiError("Nexa couldn't reach the server. Check your connection.", { code: "network" });
  }
  clearTimeout(timeout);

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response body; fall through to status-based handling below.
  }

  if (!response.ok) {
    const message = data?.error?.message || "Nexa couldn't complete that request.";
    throw new NexaApiError(message, { status: response.status, code: data?.error?.code });
  }

  return data;
}

/** Send a chat message with the current workspace context. */
export async function askNexa({ message, context }) {
  const data = await postJson("/api/ai/chat", { message, context });
  return data.reply;
}

/** Ask the backend to rank the supplied tasks. Returns recommendations
 * referencing only task IDs that were sent. */
export async function prioritizeTasks({ tasks }) {
  const data = await postJson("/api/ai/prioritize", { tasks });
  return data.recommendations ?? [];
}

/** Ask the backend to lay out a realistic schedule from current tasks. */
export async function planMyDay({ tasks }) {
  const data = await postJson("/api/ai/plan", { tasks });
  return data.plan ?? [];
}

/** Ask the backend to turn freeform notes into structured task drafts. */
export async function turnNotesIntoTasks({ notes }) {
  const data = await postJson("/api/ai/notes-to-tasks", { notes });
  return data.tasks ?? [];
}

export { NexaApiError };
