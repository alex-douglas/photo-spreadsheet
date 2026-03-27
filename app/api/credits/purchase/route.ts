import { NextRequest, NextResponse } from "next/server";
import { addCreditsToEmail, getSupabaseAdmin, normalizeEmail } from "@/lib/credits-server";
import { getPackById } from "@/lib/credit-packs";

/**
 * Mock purchase — adds credits without Stripe. Wire payment verification here later.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, packId } = body as { email?: string; packId?: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const pack = packId ? getPackById(packId) : undefined;
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Credits server not configured (missing Supabase)." },
        { status: 503 }
      );
    }

    const e = normalizeEmail(email);
    const { credits } = await addCreditsToEmail(supabase, e, pack.credits);
    return NextResponse.json({
      credits,
      email: e,
      granted: pack.credits,
      note: "Mock purchase — no payment processed.",
    });
  } catch (e) {
    console.error("[credits/purchase]", e);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}
