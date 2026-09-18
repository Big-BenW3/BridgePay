import { NextResponse } from "next/server";
import { PollarClient } from "@pollar/core";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

function getServerClient(): PollarClient {
  const apiKey = process.env.POLLAR_API_KEY || process.env.POLLAR_SECRET || "";
  const network = (process.env.POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";
  if (!apiKey) throw new Error("Pollar API key missing — set POLLAR_API_KEY in .env");
  return new PollarClient({ apiKey, stellarNetwork: network });
}

export async function GET() {
  try {
    const client = getServerClient();

    const wallet = client.getWallet();
    let kycStatus: { status: string } = { status: "unknown" };
    let balance: { asset: string; balance: string }[] = [];

    try { kycStatus = await client.getKycStatus(); } catch { /* ignore */ }
    try {
      await client.refreshBalance?.();
      const anyClient = client as unknown as Record<string, unknown>;
      if (typeof anyClient["walletBalance"] === "object" && anyClient["walletBalance"]) {
        const wb = anyClient["walletBalance"] as Record<string, unknown>;
        if (wb.data && typeof wb.data === "object" && "balances" in wb.data) {
          const rawBalances = (wb.data as { balances: { code?: string; asset?: string; balance: string }[] }).balances;
          balance = rawBalances.map((b) => ({ asset: b.asset ?? b.code ?? "unknown", balance: b.balance }));
        }
      }
    } catch { /* ignore */ }

    const escrowWalletId = process.env.ESCROW_WALLET_ID;
    const escrowConfigured = escrowWalletId && escrowWalletId !== "..." && !escrowWalletId.includes("...") && escrowWalletId.startsWith("G");

    // Real on-chain balances of the designated escrow account (Horizon). null = unavailable.
    let escrowBalance: { asset: string; balance: string }[] | null = null;
    if (escrowConfigured && escrowWalletId) {
      try {
        const net = (process.env.POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";
        const eb = await client.getWalletBalance(escrowWalletId, net);
        const rec = eb as unknown as Record<string, unknown>;
        const raw = rec.balances ?? (rec.data as Record<string, unknown> | undefined)?.balances ?? [];
        if (Array.isArray(raw)) {
          escrowBalance = (raw as { code?: string; asset?: string; asset_code?: string; balance?: string | number }[]).map((b) => ({
            asset: b.asset ?? b.code ?? b.asset_code ?? "unknown",
            balance: String(b.balance ?? "0"),
          }));
        }
      } catch {
        escrowBalance = null;
      }
    }

    return NextResponse.json({
      ok: true,
      wallet: wallet ? { address: wallet.address } : null,
      kycStatus: kycStatus.status,
      balance,
      escrowConfigured,
      escrowWalletId: escrowConfigured ? escrowWalletId : null,
      escrowBalance,
    });
  } catch (error) {
    console.error("[API] /api/pollar GET error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const body = await req.json();

    if (action === "release") {
      const { destination, asset, amount } = body;
      if (!destination || !asset || !amount) {
        return NextResponse.json({ error: "Missing destination, asset, or amount" }, { status: 400 });
      }

      const client = getServerClient();
      const res = await client.sendPayment({
        destination,
        asset: asset as never,
        amount,
      } as Parameters<typeof client.sendPayment>[0]);

      const r = res as unknown as Record<string, unknown>;
      const hash = (r.hash as string) ?? (r.txHash as string) ?? (r.id as string) ?? `tx_${Date.now()}`;

      // Log to DB
      await prisma.escrowTransaction.create({
        data: {
          jobId: body.jobId ?? "unknown",
          pollarTxId: hash,
          amount: new Prisma.Decimal(amount),
          currency: "USDC",
          type: "release",
          rawRequest: body as Prisma.InputJsonValue,
          rawResponse: r as Prisma.InputJsonValue,
        },
      });

      return NextResponse.json({ txId: hash, toAddress: destination, amount });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[API] /api/pollar POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}