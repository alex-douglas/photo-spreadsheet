import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe-server";
import { addCreditsToEmail, getSupabaseAdmin } from "@/lib/credits-server";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[stripe/webhook] Missing signature or webhook secret");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const email = pi.metadata.email;
    const credits = parseInt(pi.metadata.credits || "0", 10);

    if (!email || credits < 1) {
      console.error("[stripe/webhook] Missing metadata", pi.metadata);
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("[stripe/webhook] Supabase not configured");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
      const { alreadyGranted } = await addCreditsToEmail(supabase, email, credits, pi.id);
      if (alreadyGranted) {
        console.info(`[stripe/webhook] Credits already granted for ${pi.id}`);
      } else {
        console.info(`[stripe/webhook] Granted ${credits} credits to ${email}`);
      }
    } catch (e) {
      console.error("[stripe/webhook] Failed to add credits:", e);
      return NextResponse.json({ error: "Credit grant failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
