const KEY = "photosheet.linked_email.v1";

export function getLinkedEmail(): string | null {
  if (typeof window === "undefined") return null;
  const e = localStorage.getItem(KEY)?.trim();
  return e && e.includes("@") ? e.toLowerCase() : null;
}

export function setLinkedEmail(email: string | null): void {
  if (typeof window === "undefined") return;
  if (!email) {
    localStorage.removeItem(KEY);
    return;
  }
  localStorage.setItem(KEY, email.trim().toLowerCase());
}
