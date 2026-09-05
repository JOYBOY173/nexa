// All date logic lives here so components never duplicate it.
// Dates are stored as local-timezone "YYYY-MM-DD" strings (or null).

export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function tomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateKey(d);
}

export function daysFromNowKey(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

export function parseDateKey(key) {
  if (!key) return null;
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function isPast(key) {
  if (!key) return false;
  return key < todayKey();
}

export function isUpcoming(key) {
  if (!key) return false;
  return key > todayKey();
}

export function formatDueDate(key) {
  if (!key) return "No date";
  if (key === todayKey()) return "Today";
  if (key === tomorrowKey()) return "Tomorrow";
  const date = parseDateKey(key);
  if (!date) return "No date";
  const isPastDate = key < todayKey();
  const formatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return isPastDate ? `${formatted} (overdue)` : formatted;
}

export function getGreeting(name) {
  const hour = new Date().getHours();
  let salutation = "Good evening";
  if (hour < 12) salutation = "Good morning";
  else if (hour < 18) salutation = "Good afternoon";
  return name ? `${salutation}, ${name}` : salutation;
}

export function formatTimeLabel(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
