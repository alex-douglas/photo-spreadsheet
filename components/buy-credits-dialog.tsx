"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Coins, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCredits } from "@/components/credits-provider";
import {
  CREDIT_PACKS,
  CUSTOM_MIN,
  CUSTOM_MAX,
  creditsToPrice,
  validateCustomCredits,
} from "@/lib/credit-packs";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Step = "select" | "pay" | "success";

interface PayInfo {
  credits: number;
  label: string;
  price: string;
}

interface BuyCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlight?: string;
}

export function BuyCreditsDialog({
  open,
  onOpenChange,
  highlight,
}: BuyCreditsDialogProps) {
  const { deviceId, linkedEmail, setLinkedEmailState, refresh } = useCredits();
  const [step, setStep] = useState<Step>("select");
  const [email, setEmail] = useState(linkedEmail ?? "");
  const [payInfo, setPayInfo] = useState<PayInfo | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [grantedCredits, setGrantedCredits] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [linkEmail, setLinkEmail] = useState(linkedEmail ?? "");
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("select");
        setClientSecret(null);
        setPayInfo(null);
        setGrantedCredits(0);
        setError(null);
        setCreating(false);
        setLinkMessage(null);
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    if (open && linkedEmail) {
      setEmail(linkedEmail);
      setLinkEmail(linkedEmail);
    }
  }, [open, linkedEmail]);

  function validateEmail(): string | null {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return "Enter a valid email for your receipt and credit balance.";
    return null;
  }

  async function createPaymentIntent(body: Record<string, unknown>, info: PayInfo) {
    const emailErr = validateEmail();
    if (emailErr) { setError(emailErr); return; }

    setError(null);
    setCreating(true);
    setPayInfo(info);
    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, email: email.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Could not start payment");
      setClientSecret(j.clientSecret);
      setStep("pay");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPayInfo(null);
    } finally {
      setCreating(false);
    }
  }

  function handleSelectPack(packId: string) {
    const pack = CREDIT_PACKS.find((p) => p.id === packId)!;
    void createPaymentIntent(
      { packId },
      { credits: pack.credits, label: pack.label, price: pack.price }
    );
  }

  function handleCustomPurchase(credits: number) {
    const { price } = creditsToPrice(credits);
    void createPaymentIntent(
      { credits },
      { credits, label: `${credits} credits`, price }
    );
  }

  const handlePaymentSuccess = useCallback(
    async (piId: string) => {
      try {
        const res = await fetch("/api/stripe/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: piId }),
        });
        const j = await res.json();
        if (res.ok) {
          setGrantedCredits(j.granted ?? 0);
          if (j.email) setLinkedEmailState(j.email);
        }
      } catch {
        // Non-critical — webhook will handle credit grant
      }
      await refresh();
      setStep("success");
    },
    [refresh, setLinkedEmailState]
  );

  async function handleLink() {
    setLinkMessage(null);
    if (!linkEmail.trim() || !linkEmail.includes("@")) {
      setLinkMessage("Enter the email you used when buying credits.");
      return;
    }
    setLinkBusy(true);
    try {
      const res = await fetch("/api/credits/link-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, email: linkEmail.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Could not link");
      setLinkedEmailState(j.email);
      setEmail(j.email);
      await refresh();
      setLinkMessage(`Linked. Balance: ${j.credits} credits.`);
    } catch (e) {
      setLinkMessage(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLinkBusy(false);
    }
  }

  const elementsOptions: StripeElementsOptions | undefined = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: { borderRadius: "8px" },
        },
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg" showCloseButton>
        {step === "select" && (
          <SelectStep
            email={email}
            setEmail={setEmail}
            highlight={highlight}
            error={error}
            creating={creating}
            onSelectPack={handleSelectPack}
            onCustomPurchase={handleCustomPurchase}
            linkEmail={linkEmail}
            setLinkEmail={setLinkEmail}
            linkBusy={linkBusy}
            linkMessage={linkMessage}
            onLink={handleLink}
            onClose={() => onOpenChange(false)}
          />
        )}

        {step === "pay" && clientSecret && elementsOptions && payInfo && (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <PayStep
              payInfo={payInfo}
              onBack={() => {
                setStep("select");
                setClientSecret(null);
                setPayInfo(null);
              }}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}

        {step === "success" && (
          <SuccessStep
            credits={grantedCredits}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Step 1: Select Pack ---------- */

function SelectStep({
  email,
  setEmail,
  highlight,
  error,
  creating,
  onSelectPack,
  onCustomPurchase,
  linkEmail,
  setLinkEmail,
  linkBusy,
  linkMessage,
  onLink,
  onClose,
}: {
  email: string;
  setEmail: (v: string) => void;
  highlight?: string;
  error: string | null;
  creating: boolean;
  onSelectPack: (packId: string) => void;
  onCustomPurchase: (credits: number) => void;
  linkEmail: string;
  setLinkEmail: (v: string) => void;
  linkBusy: boolean;
  linkMessage: string | null;
  onLink: () => void;
  onClose: () => void;
}) {
  const [customInput, setCustomInput] = useState("");

  const parsedCustom = useMemo(() => {
    const n = Number(customInput);
    return customInput.trim() && Number.isFinite(n) && n > 0 ? n : null;
  }, [customInput]);

  const isCustomValid = parsedCustom !== null && validateCustomCredits(parsedCustom) === null;

  const customWarning = useMemo(() => {
    if (!customInput.trim()) return null;
    if (parsedCustom === null) return null;
    return validateCustomCredits(parsedCustom);
  }, [customInput, parsedCustom]);

  const customPrice = useMemo(() => {
    if (!isCustomValid || parsedCustom === null) return null;
    return creditsToPrice(parsedCustom).price;
  }, [isCustomValid, parsedCustom]);

  function handleCustomSubmit() {
    if (!isCustomValid || parsedCustom === null) return;
    onCustomPurchase(parsedCustom);
  }

  function handleCustomInputChange(raw: string) {
    const cleaned = raw.replace(/[^0-9]/g, "");
    if (!cleaned) { setCustomInput(""); return; }
    const n = Number(cleaned);
    if (n > CUSTOM_MAX) return;
    setCustomInput(cleaned);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Coins className="size-5 text-primary" aria-hidden />
          Buy Credits
        </DialogTitle>
        <DialogDescription>
          One credit = one image scan or one PDF page. Choose a pack or enter a
          custom amount.
        </DialogDescription>
      </DialogHeader>

      {highlight && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
          {highlight}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="buy-email">Email for receipt &amp; credit balance</Label>
        <Input
          id="buy-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {CREDIT_PACKS.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="secondary"
            disabled={creating}
            className="flex h-auto flex-col gap-1 py-3"
            onClick={() => onSelectPack(p.id)}
          >
            <span className="font-semibold">{p.label}</span>
            <span className="text-xs text-muted-foreground">{p.price}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-credits">Or enter a custom amount</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="custom-credits"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={`${CUSTOM_MIN}–${CUSTOM_MAX}`}
              value={customInput}
              onChange={(e) => handleCustomInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCustomSubmit(); } }}
              className="pr-20"
            />
            {customPrice && (
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                = {customPrice}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant={isCustomValid ? "default" : "secondary"}
            disabled={creating || !isCustomValid}
            onClick={handleCustomSubmit}
            className={isCustomValid ? "bg-green-600 text-white hover:bg-green-700" : ""}
          >
            Buy
          </Button>
        </div>
        {customWarning && <p className="text-xs text-destructive">{customWarning}</p>}
      </div>

      <p className="text-xs text-muted-foreground">
        By purchasing credits, you agree to our{" "}
        <a href="/terms" target="_blank" className="underline underline-offset-2 hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </a>
        . All sales are final.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          Already bought credits?
        </p>
        <p className="text-xs text-muted-foreground">
          Enter the same email to merge this browser&apos;s balance into your
          email wallet.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="link-email">Email</Label>
            <Input
              id="link-email"
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={linkBusy}
            onClick={onLink}
          >
            Link email
          </Button>
        </div>
      </div>

      {linkMessage && (
        <p className="text-sm text-muted-foreground">{linkMessage}</p>
      )}

      <DialogFooter>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}

/* ---------- Step 2: Payment ---------- */

function PayStep({
  payInfo,
  onBack,
  onSuccess,
}: {
  payInfo: PayInfo;
  onBack: () => void;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPayError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      setPayError(error.message ?? "Payment failed");
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setPayError("Payment was not completed. Please try again.");
      setProcessing(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Coins className="size-5 text-primary" aria-hidden />
          {payInfo.label} — {payInfo.price}
        </DialogTitle>
        <DialogDescription>
          Enter your payment details below. Your card will be charged{" "}
          {payInfo.price}.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement options={{ layout: "tabs" }} />

        {payError && <p className="text-sm text-destructive">{payError}</p>}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={processing}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!stripe || processing}
            className="ml-auto"
          >
            {processing ? (
              <>
                <Loader2 className="mr-1 size-4 animate-spin" />
                Processing…
              </>
            ) : (
              `Pay ${payInfo.price}`
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

/* ---------- Step 3: Success ---------- */

function SuccessStep({
  credits,
  onClose,
}: {
  credits: number;
  onClose: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="size-12 text-green-500" />
          <DialogTitle>Payment Successful</DialogTitle>
          <DialogDescription>
            {credits > 0
              ? `${credits} credits have been added to your account.`
              : "Your credits have been added to your account."}
          </DialogDescription>
        </div>
      </DialogHeader>
      <DialogFooter>
        <Button type="button" onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </>
  );
}
