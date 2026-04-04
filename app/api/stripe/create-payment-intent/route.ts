import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";
import { getPackById } from "@/lib/credit-packs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packId, email } = body as { packId?: string; email?: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const pack = packId ? getPackById(packId) : undefined;
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pack.priceInCents,
      currency: "usd",
      receipt_email: email.trim().toLowerCase(),
      metadata: {
        packId: pack.id,
        credits: String(pack.credits),
        email: email.trim().toLowerCase(),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: pack.priceInCents,
      credits: pack.credits,
    });
  } catch (e) {
    console.error("[stripe/create-payment-intent]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
