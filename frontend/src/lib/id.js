// Small dependency-free unique id generator — good enough for a local,
// single-user demo workspace (no collisions across a session in practice).
export function createId(prefix = "id") {
  const random = Math.random().toString(36).slice(2, 9);
  const time = Date.now().toString(36).slice(-5);
  return `${prefix}_${time}${random}`;
}
