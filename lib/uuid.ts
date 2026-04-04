/** crypto.randomUUID() requires a secure context (HTTPS / localhost). */
export function generateId(prefix = ""): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const p = prefix ? `${prefix}-` : "";
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;
}
