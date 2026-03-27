import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const MAX_NEW_DEVICES_PER_IP_PER_DAY = 12;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function creditCostForUpload(mimeType: string, pdfPageCount: number | undefined): number {
  if (mimeType === "application/pdf") {
    const p = pdfPageCount && pdfPageCount > 0 ? pdfPageCount : 1;
    return p;
  }
  return 1;
}

async function countDevicesFromIpSinceUtcMidnight(
  supabase: SupabaseClient,
  ipHash: string
): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("device_wallets")
    .select("*", { count: "exact", head: true })
    .eq("first_ip_hash", ipHash)
    .gte("created_at", start.toISOString());
  if (error) {
    console.warn("[credits] ip count error", error);
    return 0;
  }
  return count ?? 0;
}

export async function getEmailCredits(supabase: SupabaseClient, email: string): Promise<number> {
  const e = normalizeEmail(email);
  const { data, error } = await supabase.from("email_wallets").select("credits").eq("email", e).maybeSingle();
  if (error || !data) return 0;
  return Math.max(0, data.credits);
}

export async function getDeviceCredits(supabase: SupabaseClient, deviceId: string): Promise<number> {
  const { data, error } = await supabase
    .from("device_wallets")
    .select("credits")
    .eq("device_id", deviceId)
    .maybeSingle();
  if (error || !data) return 0;
  return Math.max(0, data.credits);
}

/** After a successful link, only the email wallet applies. */
export async function getAvailableCredits(
  supabase: SupabaseClient,
  deviceId: string,
  linkedEmail: string | null | undefined
): Promise<number> {
  if (linkedEmail) {
    return getEmailCredits(supabase, linkedEmail);
  }
  return getDeviceCredits(supabase, deviceId);
}

export async function bootstrapDeviceWallet(
  supabase: SupabaseClient,
  deviceId: string,
  ipHash: string
): Promise<{ credits: number; created: boolean }> {
  const { data: existing, error: readErr } = await supabase
    .from("device_wallets")
    .select("credits")
    .eq("device_id", deviceId)
    .maybeSingle();
  if (readErr) {
    console.error("[credits] bootstrap read", readErr);
    throw new Error("Could not read wallet");
  }
  if (existing) {
    return { credits: Math.max(0, existing.credits), created: false };
  }

  const ipCount = await countDevicesFromIpSinceUtcMidnight(supabase, ipHash);
  const starting = ipCount < MAX_NEW_DEVICES_PER_IP_PER_DAY ? 1 : 0;

  const { data: inserted, error: insErr } = await supabase
    .from("device_wallets")
    .insert({
      device_id: deviceId,
      credits: starting,
      first_ip_hash: ipHash,
      updated_at: new Date().toISOString(),
    })
    .select("credits")
    .maybeSingle();

  if (insErr) {
    if (insErr.code === "23505") {
      const credits = await getDeviceCredits(supabase, deviceId);
      return { credits, created: false };
    }
    console.error("[credits] bootstrap insert", insErr);
    throw new Error("Could not create wallet");
  }

  return { credits: Math.max(0, inserted?.credits ?? starting), created: true };
}

export async function decrementCredits(
  supabase: SupabaseClient,
  deviceId: string,
  linkedEmail: string | null | undefined,
  amount: number
): Promise<{ creditsRemaining: number }> {
  if (amount < 1) throw new Error("Invalid debit amount");

  const table = linkedEmail ? "email_wallets" : "device_wallets";
  const col = linkedEmail ? "email" : "device_id";
  const id = linkedEmail ? normalizeEmail(linkedEmail) : deviceId;

  const { data: row, error: selErr } = await supabase
    .from(table)
    .select("credits")
    .eq(col, id)
    .maybeSingle();
  if (selErr) throw new Error("Wallet lookup failed");
  if (!row || row.credits < amount) throw new Error("Insufficient credits");

  const { data: updated, error: upErr } = await supabase
    .from(table)
    .update({
      credits: row.credits - amount,
      updated_at: new Date().toISOString(),
    })
    .eq(col, id)
    .eq("credits", row.credits)
    .select("credits")
    .maybeSingle();

  if (upErr || !updated) throw new Error("Could not debit credits");
  return { creditsRemaining: updated.credits };
}

export async function linkEmailWallet(
  supabase: SupabaseClient,
  deviceId: string,
  email: string
): Promise<{ credits: number }> {
  const e = normalizeEmail(email);
  const devCredits = await getDeviceCredits(supabase, deviceId);
  const emailCredits = await getEmailCredits(supabase, e);
  const merged = devCredits + emailCredits;

  const { error: upErr } = await supabase.from("email_wallets").upsert(
    {
      email: e,
      credits: merged,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email", ignoreDuplicates: false }
  );
  if (upErr) throw new Error("Could not save email wallet");

  await supabase.from("device_wallets").delete().eq("device_id", deviceId);

  return { credits: merged };
}

export async function addCreditsToEmail(
  supabase: SupabaseClient,
  email: string,
  delta: number
): Promise<{ credits: number }> {
  if (delta < 1) throw new Error("Invalid credit pack");
  const e = normalizeEmail(email);
  const cur = await getEmailCredits(supabase, e);
  const next = cur + delta;
  const { error } = await supabase.from("email_wallets").upsert(
    {
      email: e,
      credits: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email", ignoreDuplicates: false }
  );
  if (error) throw new Error("Could not add credits");
  return { credits: next };
}

export { getSupabaseAdmin };
