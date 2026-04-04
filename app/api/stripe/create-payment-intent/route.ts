import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";
import { getPackById, CENTS_PER_CREDIT, CUSTOM_MIN, CUSTOM_MAX, validateCustomCredits } from "@/lib/credit-packs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packId, credits: customCredits, email } = body as {
      packId?: string;
      credits?: number;
      email?: string;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    let amountInCents: number;
    let credits: number;
    let label: string;

    if (packId) {
      const pack = getPackById(packId);
      if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
      amountInCents = pack.priceInCents;
      credits = pack.credits;
      label = pack.id;
    } else if (typeof customCredits === "number") {
      const err = validateCustomCredits(customCredits);
      if (err) return NextResponse.json({ error: err }, { status: 400 });
      credits = customCredits;
      amountInCents = credits * CENTS_PER_CREDIT;
      label = `custom-${credits}`;
    } else {
      return NextResponse.json({ error: "packId or credits required" }, { status: 400 });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      receipt_email: email.trim().toLowerCase(),
      metadata: {
        packId: label,
        credits: String(credits),
        email: email.trim().toLowerCase(),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
      credits,
    });
  } catch (e) {
    console.error("[stripe/create-payment-intent]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
