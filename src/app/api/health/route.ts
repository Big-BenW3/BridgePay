import { NextResponse } from "next/server";
export async function GET() {
  const escrowWalletId = process.env.ESCROW_WALLET_ID;
  const escrowConfigured = escrowWalletId && escrowWalletId !== "..." && !escrowWalletId.includes("...") && escrowWalletId.startsWith("G");
  return NextResponse.json({
    ok: true,
    app: "BridgePay",
    network: process.env.POLLAR_NETWORK || "testnet",
    hasPollarKey: !!process.env.POLLAR_API_KEY,
    escrow: escrowConfigured ? "configured" : "pending — set ESCROW_WALLET_ID (G…) in .env or run scripts/create-escrow.ts",
    version: "mvp",
  });
}