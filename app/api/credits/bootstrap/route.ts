import { NextRequest, NextResponse } from "next/server";
import { bootstrapDeviceWallet, getSupabaseAdmin, normalizeEmail } from "@/lib/credits-server";
import { hashClientIp } from "@/lib/ip-hash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, linkedEmail } = body as { deviceId?: string; linkedEmail?: string | null };

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "deviceId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        credits: null,
        mode: "unconfigured" as const,
        hint: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for server-side credits.",
      });
    }

    const ipHash = hashClientIp(req);

    if (linkedEmail && typeof linkedEmail === "string" && linkedEmail.includes("@")) {
      const e = normalizeEmail(linkedEmail);
      const { data: emailRow } = await supabase.from("email_wallets").select("credits").eq("email", e).maybeSingle();
      if (emailRow) {
        return NextResponse.json({
          credits: Math.max(0, emailRow.credits),
          mode: "supabase" as const,
          wallet: "email" as const,
        });
      }
    }

    const { credits } = await bootstrapDeviceWallet(supabase, deviceId, ipHash);
    return NextResponse.json({
      credits,
      mode: "supabase" as const,
      wallet: "device" as const,
    });
  } catch (e) {
    console.error("[credits/bootstrap]", e);
    return NextResponse.json({ error: "Bootstrap failed" }, { status: 500 });
  }
}
