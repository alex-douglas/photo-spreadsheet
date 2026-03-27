/** Used when Supabase is not configured: best-effort balance in localStorage (not abuse-safe). */
const KEY = "photosheet.local_credits.v1";

export function getLocalCreditBalance(): number {
  if (typeof window === "undefined") return 1;
  const raw = localStorage.getItem(KEY);
  if (raw === null) {
    localStorage.setItem(KEY, "1");
    return 1;
  }
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 1;
}

export function setLocalCreditBalance(n: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(Math.max(0, n)));
}

export function debitLocalCredits(amount: number): number {
  const next = Math.max(0, getLocalCreditBalance() - amount);
  setLocalCreditBalance(next);
  return next;
}

/** Dev / no-Supabase: grant mock-purchased credits in this browser only. */
export function addLocalCredits(amount: number): number {
  if (amount < 1) return getLocalCreditBalance();
  const next = getLocalCreditBalance() + amount;
  setLocalCreditBalance(next);
  return next;
}
