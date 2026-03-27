"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { BuyCreditsDialog } from "@/components/buy-credits-dialog";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { debitLocalCredits, getLocalCreditBalance } from "@/lib/credits-local-fallback";
import { getLinkedEmail, setLinkedEmail as persistLinkedEmail } from "@/lib/linked-email";

export type CreditsMode = "supabase" | "unconfigured";

interface ExtractCreditsPayload {
  creditCost: number;
  creditsRemaining: number | null;
  creditsSource: string;
}

interface CreditsContextValue {
  credits: number;
  creditsMode: CreditsMode;
  deviceId: string;
  linkedEmail: string | null;
  refresh: () => Promise<void>;
  setLinkedEmailState: (email: string | null) => void;
  applyExtractResult: (payload: ExtractCreditsPayload) => void;
  openBuyCredits: (highlight?: string) => void;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function useCredits(): CreditsContextValue {
  const v = useContext(CreditsContext);
  if (!v) throw new Error("useCredits must be used within CreditsProvider");
  return v;
}

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [deviceId] = useState(() => getOrCreateDeviceId());
  const [linkedEmail, setLinkedEmail] = useState<string | null>(() => getLinkedEmail());
  const [credits, setCredits] = useState(0);
  const [creditsMode, setCreditsMode] = useState<CreditsMode>("unconfigured");
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyHighlight, setBuyHighlight] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!deviceId) {
      setCredits(getLocalCreditBalance());
      setCreditsMode("unconfigured");
      return;
    }
    const res = await fetch("/api/credits/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, linkedEmail }),
    });
    const j = (await res.json()) as {
      credits?: number | null;
      mode?: string;
    };
    if (j.mode === "unconfigured" || j.credits === null || j.credits === undefined) {
      setCreditsMode("unconfigured");
      setCredits(getLocalCreditBalance());
    } else {
      setCreditsMode("supabase");
      setCredits(typeof j.credits === "number" ? j.credits : 0);
    }
  }, [deviceId, linkedEmail]);

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(t);
  }, [refresh]);

  const setLinkedEmailState = useCallback((email: string | null) => {
    setLinkedEmail(email);
    persistLinkedEmail(email);
  }, []);

  const applyExtractResult = useCallback((payload: ExtractCreditsPayload) => {
    if (payload.creditsSource === "supabase" && typeof payload.creditsRemaining === "number") {
      setCredits(payload.creditsRemaining);
      return;
    }
    const next = debitLocalCredits(payload.creditCost);
    setCredits(next);
  }, []);

  const openBuyCredits = useCallback((highlight?: string) => {
    setBuyHighlight(highlight);
    setBuyOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      credits,
      creditsMode,
      deviceId,
      linkedEmail,
      refresh,
      setLinkedEmailState,
      applyExtractResult,
      openBuyCredits,
    }),
    [
      credits,
      creditsMode,
      deviceId,
      linkedEmail,
      refresh,
      setLinkedEmailState,
      applyExtractResult,
      openBuyCredits,
    ]
  );

  return (
    <CreditsContext.Provider value={value}>
      {children}
      <BuyCreditsDialog
        open={buyOpen}
        onOpenChange={(o) => {
          setBuyOpen(o);
          if (!o) setBuyHighlight(undefined);
        }}
        highlight={buyHighlight}
      />
    </CreditsContext.Provider>
  );
}
