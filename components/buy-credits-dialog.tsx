"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

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
import { CREDIT_PACKS } from "@/lib/credit-packs";
import { addLocalCredits } from "@/lib/credits-local-fallback";

interface BuyCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlight?: string;
}

export function BuyCreditsDialog({ open, onOpenChange, highlight }: BuyCreditsDialogProps) {
  const { deviceId, linkedEmail, setLinkedEmailState, refresh } = useCredits();
  const [email, setEmail] = useState(linkedEmail ?? "");
  const [linkEmail, setLinkEmail] = useState(linkedEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePurchase(packId: string) {
    setMessage(null);
    if (!email.trim() || !email.includes("@")) {
      setMessage("Enter a valid email for your receipt and credit balance.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), packId }),
      });
      const j = (await res.json()) as {
        error?: string;
        credits?: number;
        email?: string;
        granted?: number;
        note?: string;
      };

      if (res.status === 503) {
        const pack = CREDIT_PACKS.find((p) => p.id === packId);
        const granted = pack?.credits ?? 0;
        if (granted < 1) throw new Error("Invalid pack");
        addLocalCredits(granted);
        setLinkedEmailState(email.trim().toLowerCase());
        await refresh();
        setMessage(
          `${granted} credits added in this browser (dev — no Supabase). With Supabase configured, the same flow writes to email_wallets.`
        );
        return;
      }

      if (!res.ok) throw new Error(j.error || "Purchase failed");
      if (j.email) setLinkedEmailState(j.email);
      await refresh();
      setMessage(`${j.granted ?? 0} credits added (mock payment — wire Stripe later). ${j.note ?? ""}`.trim());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleLink() {
    setMessage(null);
    if (!linkEmail.trim() || !linkEmail.includes("@")) {
      setMessage("Enter the email you used when buying credits.");
      return;
    }
    setBusy(true);
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
      setMessage(`Linked. Balance: ${j.credits} credits.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="size-5 text-primary" aria-hidden />
            Credits
          </DialogTitle>
          <DialogDescription>
            One credit = one image scan, or one PDF page. New visitors get 1 free credit (tracked per browser +
            IP when Supabase is configured).             Mock purchases add credits to your email row in Supabase when the server is configured; otherwise they
            add to this browser only for local dev at PhotoToSheet.com. Wire Stripe in the purchase API when
            you&apos;re ready.
          </DialogDescription>
        </DialogHeader>

        {highlight && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">{highlight}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="buy-email">Email for purchases &amp; recovery</Label>
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
              disabled={busy}
              className="flex h-auto flex-col gap-1 py-3"
              onClick={() => void handlePurchase(p.id)}
            >
              <span className="font-semibold">{p.label}</span>
              <span className="text-xs text-muted-foreground">{p.price} · mock</span>
            </Button>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Already bought credits?</p>
          <p className="text-xs text-muted-foreground">
            Enter the same email to merge this browser&apos;s balance into your email wallet (one-time per
            browser).
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
            <Button type="button" variant="outline" disabled={busy} onClick={() => void handleLink()}>
              Link email
            </Button>
          </div>
        </div>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
