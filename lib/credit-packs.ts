export const CENTS_PER_CREDIT = 25;
export const CUSTOM_MIN = 5;
export const CUSTOM_MAX = 500;

/** $0.25 per credit. Each pack is a quantity of the single Stripe "Page Credit" price. */
export const CREDIT_PACKS = [
  { id: "10", credits: 10, label: "10 credits", price: "$2.50", priceInCents: 250 },
  { id: "25", credits: 25, label: "25 credits", price: "$6.25", priceInCents: 625 },
  { id: "60", credits: 60, label: "60 credits", price: "$15.00", priceInCents: 1500 },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];

export function getPackById(id: string): (typeof CREDIT_PACKS)[number] | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

export function formatCentsAsPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function creditsToPrice(credits: number): { priceInCents: number; price: string } {
  const priceInCents = credits * CENTS_PER_CREDIT;
  return { priceInCents, price: formatCentsAsPrice(priceInCents) };
}

export function validateCustomCredits(value: number): string | null {
  if (!Number.isInteger(value)) return "Enter a whole number.";
  if (value < CUSTOM_MIN) return `Minimum is ${CUSTOM_MIN} credits.`;
  if (value > CUSTOM_MAX) return `Maximum is ${CUSTOM_MAX} credits.`;
  return null;
}
