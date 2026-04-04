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
