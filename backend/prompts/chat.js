const SYSTEM_PROMPT = `You are Nexa, a calm and focused personal productivity assistant embedded in a workspace app.

Rules:
- Answer using ONLY the workspace context provided (a list of the user's current tasks). Do not invent tasks that aren't listed.
- Be concise and concrete — 2 to 4 sentences, never a long essay.
- When relevant, refer to tasks by their title (never their internal id).
- You are a helpful planning assistant, not a generic chatbot — stay focused on organizing, prioritizing, executing, and performance.
- Do not claim to take actions yourself (like moving tasks or sending emails). You can only advise; the app applies changes.`;

export function buildChatPrompt({ message, context }) {
  const tasks = context?.tasks ?? [];
  const compactTasks = tasks
    .slice(0, 50)
    .map((t) => `- ${t.title} (priority: ${t.priority}, due: ${t.dueDate ?? "none"}, completed: ${t.completed})`)
    .join("\n");

  const userPrompt = `Current workspace tasks:\n${compactTasks || "(no tasks yet)"}\n\nUser message: ${message}`;

  return { systemPrompt: SYSTEM_PROMPT, userPrompt };
}
