/** Mock packs until Stripe. Price labels for UI only. */
export const CREDIT_PACKS = [
  { id: "10", credits: 10, label: "10 credits", price: "$4.99" },
  { id: "25", credits: 25, label: "25 credits", price: "$9.99" },
  { id: "60", credits: 60, label: "60 credits", price: "$19.99" },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];

export function getPackById(id: string): (typeof CREDIT_PACKS)[number] | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}
