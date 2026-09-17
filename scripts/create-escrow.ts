// Option 1 — Resolve the Stellar escrow wallet for BridgePay.
// Usage: npx tsx scripts/create-escrow.ts  (needs POLLAR_API_KEY in .env)
//
// Honest behavior: this script NEVER invents a G... address. It prints the
// server wallet address visible to the SDK and tells you how to create a
// dedicated escrow wallet in the Pollar Dashboard. Only a real address from
// the Dashboard (or SDK) should go into ESCROW_WALLET_ID.
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const key = process.env.POLLAR_API_KEY || process.env.POLLAR_SECRET || "";
  const network = process.env.POLLAR_NETWORK || "testnet";
  if (!key) {
    console.error("POLLAR_API_KEY missing in .env");
    process.exit(1);
  }
  console.log(`Resolving wallet on ${network}...`);
  const { PollarClient } = await import("@pollar/core");
  const client = new PollarClient({ apiKey: key, stellarNetwork: network as "testnet" | "mainnet" });
  const wallet = client.getWallet();
  if (wallet?.address) {
    console.log("SERVER_WALLET_ADDRESS=", wallet.address);
  } else {
    console.log("No server wallet visible to this API key.");
  }
  console.log("");
  console.log("To create a dedicated escrow wallet:");
  console.log("  1. Open dashboard.pollar.xyz → your BridgePay app → Users → Wallets → Create");
  console.log("  2. Copy the G... address into .env as ESCROW_WALLET_ID (and Vercel env vars)");
  console.log("  3. Re-run GET /api/health — escrow should report \"configured\"");
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
