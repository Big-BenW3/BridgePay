// Escrow check for BridgePay.
// Usage: npx tsx scripts/create-escrow.ts  (needs POLLAR_API_KEY + ESCROW_WALLET_ID in .env)
//
// Honest behavior: this script NEVER invents a G... address. It validates the
// ESCROW_WALLET_ID in .env and looks up its REAL on-chain balances via Horizon
// (PollarClient.getWalletBalance). Only a real address from the Pollar
// Dashboard should go into ESCROW_WALLET_ID.
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const key = process.env.POLLAR_API_KEY || process.env.POLLAR_SECRET || "";
  const network = (process.env.POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";
  const escrow = process.env.ESCROW_WALLET_ID || "";
  if (!key) {
    console.error("POLLAR_API_KEY missing in .env");
    process.exit(1);
  }
  const configured = escrow && !escrow.includes("...") && escrow.startsWith("G");
  if (!configured) {
    console.error("ESCROW_WALLET_ID is not a real G... address. Create one in the Pollar Dashboard (Users → Wallets → Create) and paste it into .env.");
    process.exit(1);
  }
  console.log(`ESCROW_WALLET_ID=${escrow}`);
  console.log(`Looking up on-chain balances on ${network}...`);
  const { PollarClient } = await import("@pollar/core");
  const client = new PollarClient({ apiKey: key, stellarNetwork: network });
  try {
    const res = await client.getWalletBalance(escrow, network);
    const rec = res as unknown as Record<string, unknown>;
    const raw = rec.balances ?? (rec.data as Record<string, unknown> | undefined)?.balances ?? [];
    if (Array.isArray(raw)) {
      for (const b of raw as { code?: string; asset?: string; balance?: string | number }[]) {
        console.log(`  ${b.asset ?? b.code ?? "unknown"}: ${b.balance ?? "0"}`);
      }
    } else {
      console.log("  (unexpected shape)", JSON.stringify(res).slice(0, 300));
    }
  } catch (e) {
    console.error("Balance lookup failed:", e instanceof Error ? e.message : e);
    console.error("If this fails with 403, the app key's Dashboard has not allowlisted your origin.");
    process.exit(1);
  }
  console.log('Done. GET /api/health should report escrow:"configured".');
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
