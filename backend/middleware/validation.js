// Server-side validation. We never trust the client — every payload is
// checked for shape, type, and size before it reaches the OpenAI call.

const MAX_MESSAGE_LENGTH = 500;
const MAX_NOTES_LENGTH = 2000;
const MAX_TASKS = 50;
const MAX_TASK_TITLE_LENGTH = 200;
const VALID_PRIORITIES = new Set(["high", "medium", "low"]);

function badRequest(res, message) {
  return res.status(400).json({ error: { message, code: "invalid_request" } });
}

function isValidTaskList(tasks) {
  if (!Array.isArray(tasks)) return false;
  if (tasks.length > MAX_TASKS) return false;
  return tasks.every(
    (t) =>
      t &&
      typeof t.id === "string" &&
      t.id.length > 0 &&
      typeof t.title === "string" &&
      t.title.length > 0 &&
      t.title.length <= MAX_TASK_TITLE_LENGTH
  );
}

export function validateChatRequest(req, res, next) {
  const { message, context } = req.body || {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return badRequest(res, "A message is required.");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return badRequest(res, `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
  }
  if (context && typeof context !== "object") {
    return badRequest(res, "Workspace context must be an object.");
  }
  if (context?.tasks && !isValidTaskList(context.tasks)) {
    return badRequest(res, "Workspace context contains an invalid task list.");
  }

  req.body.message = message.trim();
  next();
}

export function validatePrioritizeRequest(req, res, next) {
  const { tasks } = req.body || {};
  if (!isValidTaskList(tasks)) {
    return badRequest(res, "A valid list of tasks is required.");
  }
  if (tasks.length === 0) {
    return badRequest(res, "At least one task is required to prioritize.");
  }
  next();
}

export function validatePlanRequest(req, res, next) {
  const { tasks } = req.body || {};
  if (!isValidTaskList(tasks)) {
    return badRequest(res, "A valid list of tasks is required.");
  }
  if (tasks.length === 0) {
    return badRequest(res, "At least one task is required to build a plan.");
  }
  next();
}

export function validateNotesRequest(req, res, next) {
  const { notes } = req.body || {};
  if (typeof notes !== "string" || notes.trim().length === 0) {
    return badRequest(res, "Notes text is required.");
  }
  if (notes.length > MAX_NOTES_LENGTH) {
    return badRequest(res, `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`);
  }
  req.body.notes = notes.trim();
  next();
}

export { VALID_PRIORITIES, MAX_TASKS };
