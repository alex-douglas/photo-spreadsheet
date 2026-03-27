import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export function hashClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  const ip = fwd || real || "unknown";
  return createHash("sha256").update(ip).digest("hex");
}
