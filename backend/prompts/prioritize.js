const SYSTEM_PROMPT = `You are Nexa's prioritization engine.

You will be given a JSON list of tasks, each with an "id" and "title". Rank them and return ONLY valid JSON in this exact shape:
{"recommendations": [{"taskId": "<id from the input>", "priority": "high" | "medium" | "low", "reason": "<one short sentence>"}]}

Strict rules:
- Use ONLY the "id" values you were given. NEVER invent a new id.
- Include one recommendation per input task.
- Reasons must be one short, concrete sentence (max ~15 words).
- Return nothing except the JSON object — no markdown, no commentary.`;

export function buildPrioritizePrompt({ tasks }) {
  const payload = tasks.map((t) => ({ id: t.id, title: t.title, currentPriority: t.priority, dueDate: t.dueDate ?? null }));
  const userPrompt = `Tasks to prioritize:\n${JSON.stringify(payload)}`;
  return { systemPrompt: SYSTEM_PROMPT, userPrompt };
}
