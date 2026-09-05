export function todayKey() {
  return toKey(new Date());
}

export function tomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toKey(d);
}

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Converts the AI's "today" / "tomorrow" / null tokens into real date keys. */
export function resolveDueDateToken(token) {
  if (token === "today") return todayKey();
  if (token === "tomorrow") return tomorrowKey();
  return null;
}
