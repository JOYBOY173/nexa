import { Router } from "express";
import {
  validateChatRequest,
  validatePrioritizeRequest,
  validatePlanRequest,
  validateNotesRequest,
  VALID_PRIORITIES,
} from "../middleware/validation.js";
import { getChatReply, getStructuredResponse } from "../services/openai.js";
import { buildChatPrompt } from "../prompts/chat.js";
import { buildPrioritizePrompt } from "../prompts/prioritize.js";
import { buildPlanPrompt } from "../prompts/plan.js";
import { buildNotesPrompt } from "../prompts/notesToTasks.js";
import { resolveDueDateToken } from "../lib/dates.js";

const router = Router();

function handleAiError(res, error) {
 console.error("[Nexa AI error]", {
  status: error.status,
  code: error.code,
  message: error.message,
  response: error.response?.data,
});

  if (error.code === "missing_api_key") {
    return res.status(503).json({
      error: { message: "Nexa's AI service isn't configured on this server yet.", code: "not_configured" },
    });
  }
  if (error.name === "APIConnectionTimeoutError" || error.code === "timeout" || error.message?.includes("timeout")) {
    return res.status(504).json({ error: { message: "Nexa's AI took too long to respond.", code: "timeout" } });
  }
  if (error.status === 429) {
    return res.status(429).json({
      error: { message: "Nexa's AI provider is rate limiting requests. Try again shortly.", code: "provider_rate_limited" },
    });
  }
  return res.status(502).json({
    error: { message: "Nexa couldn't complete that request.", code: "ai_provider_error" },
  });
}

router.post("/chat", validateChatRequest, async (req, res) => {
  try {
    const { message, context } = req.body;
    const { systemPrompt, userPrompt } = buildChatPrompt({ message, context });
    const reply = await getChatReply({ systemPrompt, userPrompt });
    res.json({ reply });
  } catch (error) {
    handleAiError(res, error);
  }
});

router.post("/prioritize", validatePrioritizeRequest, async (req, res) => {
  try {
    const { tasks } = req.body;
    const validIds = new Set(tasks.map((t) => t.id));

    const { systemPrompt, userPrompt } = buildPrioritizePrompt({ tasks });
    const data = await getStructuredResponse({ systemPrompt, userPrompt });

    const recommendations = Array.isArray(data?.recommendations)
      ? data.recommendations
          .filter((r) => r && validIds.has(r.taskId) && VALID_PRIORITIES.has(r.priority))
          .map((r) => ({
            taskId: r.taskId,
            priority: r.priority,
            reason: typeof r.reason === "string" ? r.reason.slice(0, 200) : "",
          }))
      : [];

    res.json({ recommendations });
  } catch (error) {
    handleAiError(res, error);
  }
});

router.post("/plan", validatePlanRequest, async (req, res) => {
  try {
    const { tasks } = req.body;
    const validIds = new Set(tasks.map((t) => t.id));
    const titleById = new Map(tasks.map((t) => [t.id, t.title]));

    const { systemPrompt, userPrompt } = buildPlanPrompt({ tasks });
    const data = await getStructuredResponse({ systemPrompt, userPrompt });

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    const plan = Array.isArray(data?.plan)
      ? data.plan
          .filter(
            (block) =>
              block &&
              typeof block.start === "string" &&
              typeof block.end === "string" &&
              timePattern.test(block.start) &&
              timePattern.test(block.end) &&
              (block.taskId === null || validIds.has(block.taskId))
          )
          .map((block) => ({
            start: block.start,
            end: block.end,
            taskId: block.taskId ?? null,
            title: block.taskId ? titleById.get(block.taskId) ?? "Task" : String(block.title || "Break").slice(0, 60),
          }))
      : [];

    res.json({ plan });
  } catch (error) {
    handleAiError(res, error);
  }
});

router.post("/notes-to-tasks", validateNotesRequest, async (req, res) => {
  try {
    const { notes } = req.body;
    const { systemPrompt, userPrompt } = buildNotesPrompt({ notes });
    const data = await getStructuredResponse({ systemPrompt, userPrompt });

    const tasks = Array.isArray(data?.tasks)
      ? data.tasks
          .filter((t) => t && typeof t.title === "string" && t.title.trim().length > 0)
          .slice(0, 8)
          .map((t) => ({
            title: t.title.trim().slice(0, 200),
            priority: VALID_PRIORITIES.has(t.priority) ? t.priority : "medium",
            dueDate: resolveDueDateToken(t.dueDate),
          }))
      : [];

    res.json({ tasks });
  } catch (error) {
    handleAiError(res, error);
  }
});

export default router;
