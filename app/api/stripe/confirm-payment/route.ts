import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";
import { addCreditsToEmail, getSupabaseAdmin } from "@/lib/credits-server";

/**
 * Client calls this after Stripe Elements reports payment success.
 * Verifies the PaymentIntent status server-side and grants credits immediately
 * (the webhook also grants, but addCreditsToEmail is idempotent-safe via upsert).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentIntentId } = body as { paymentIntentId?: string };

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return NextResponse.json({ error: "paymentIntentId required" }, { status: 400 });
    }

    const stripe = getStripe();
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed", status: pi.status }, { status: 400 });
    }

    const email = pi.metadata.email;
    const credits = parseInt(pi.metadata.credits || "0", 10);

    if (!email || credits < 1) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { credits: newBalance } = await addCreditsToEmail(supabase, email, credits, paymentIntentId);

    return NextResponse.json({
      credits: newBalance,
      granted: credits,
      email,
    });
  } catch (e) {
    console.error("[stripe/confirm-payment]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Confirmation failed" },
      { status: 500 }
    );
  }
}
