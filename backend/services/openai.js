import OpenAI from "openai";

let client = null;

function getClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    const err = new Error(
      "Server is missing OPENROUTER_API_KEY configuration.",
    );
    err.code = "missing_api_key";
    throw err;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  return client;
}

function getModel() {
  return process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";
}

/** Plain-text chat completion, used for the conversational Ask Nexa endpoint. */
export async function getChatReply({
  systemPrompt,
  userPrompt,
  timeoutMs = 15000,
}) {
  const openai = getClient();

  const completion = await openai.chat.completions.create(
    {
      model: getModel(),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 300,
    },
    { timeout: timeoutMs },
  );

  const text = completion.choices?.[0]?.message?.content?.trim();

  if (!text) {
    const err = new Error(
      "Nexa received an empty response from the AI provider.",
    );
    err.code = "empty_response";
    throw err;
  }

  return text;
}

/** Structured JSON completion, used for prioritize / plan / notes-to-tasks. */
export async function getStructuredResponse({
  systemPrompt,
  userPrompt,
  timeoutMs = 15000,
}) {
  const openai = getClient();

  const completion = await openai.chat.completions.create(
    {
      model: getModel(),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 700,
      response_format: { type: "json_object" },
    },
    { timeout: timeoutMs },
  );

  const raw = completion.choices?.[0]?.message?.content?.trim();

  if (!raw) {
    const err = new Error(
      "Nexa received an empty response from the AI provider.",
    );
    err.code = "empty_response";
    throw err;
  }

  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const err = new Error("Nexa received a response it couldn't parse.");
    err.code = "invalid_json";
    throw err;
  }
}
