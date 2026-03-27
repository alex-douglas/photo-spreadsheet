import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, linkEmailWallet, normalizeEmail } from "@/lib/credits-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, email } = body as { deviceId?: string; email?: string };

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "deviceId required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Credits server not configured (missing Supabase)." },
        { status: 503 }
      );
    }

    const e = normalizeEmail(email);
    const { credits } = await linkEmailWallet(supabase, deviceId, e);
    return NextResponse.json({ credits, email: e });
  } catch (e) {
    console.error("[credits/link-email]", e);
    return NextResponse.json({ error: "Could not link email" }, { status: 500 });
  }
}
