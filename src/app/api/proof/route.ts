import { NextResponse } from "next/server";
import { PollarClient } from "@pollar/core";
import { prisma } from "@/lib/db";

function getServerClient(): PollarClient {
  const apiKey = process.env.POLLAR_API_KEY || process.env.POLLAR_SECRET || "";
  const network = (process.env.POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";
  if (!apiKey) throw new Error("Pollar API key missing");
  return new PollarClient({ apiKey, stellarNetwork: network });
}

function isRealStellarHash(id: string): boolean {
  // Stellar tx hashes are 32-byte hex (64 chars). Mock ids start with local_/escrow_/tx_.
  return /^[0-9a-fA-F]{64}$/.test(id);
}

export async function GET() {
  try {
    const client = getServerClient();
    const network = (process.env.POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";

    // Escrow wallet on-chain balances (Horizon)
    let escrowBalance: { asset: string; balance: string }[] | null = null;
    const escrowWalletId = process.env.ESCROW_WALLET_ID;
    const escrowConfigured = escrowWalletId && escrowWalletId !== "..." && !escrowWalletId.includes("...") && escrowWalletId.startsWith("G");
    if (escrowConfigured && escrowWalletId) {
      try {
        const eb = await client.getWalletBalance(escrowWalletId, network);
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

    // All jobs + transactions
    const jobs = await prisma.job.findMany({
      include: { transactions: true },
      orderBy: { createdAt: "desc" },
    });

    // Collect unique release/fund tx ids from DB
    const txMap = new Map<string, { id: string; amount: string; currency: string; type: "fund" | "release" | "yield_deposit" | "yield_withdraw"; timestamp: string; jobId: string }>();
    for (const job of jobs) {
      for (const t of job.transactions) {
        if (!txMap.has(t.id)) {
          txMap.set(t.id, {
            id: t.id,
            amount: t.amount.toString(),
            currency: t.currency,
            type: t.type as "fund" | "release" | "yield_deposit" | "yield_withdraw",
            timestamp: t.createdAt.toISOString(),
            jobId: job.id,
          });
        }
      }
    }

    // Verify each candidate on-chain
    const verifiedTxs: Array<{
      id: string;
      amount: string;
      currency: string;
      type: string;
      timestamp: string;
      jobId: string;
      onChain?: {
        status: "SUCCESS" | "PENDING" | "FAILED" | "mock";
        ledger?: number;
        resultCode?: string;
        message?: string;
      };
      explorerUrl?: string;
    }> = [];

    for (const [id, info] of txMap) {
      if (!isRealStellarHash(id)) {
        verifiedTxs.push({ ...info, onChain: { status: "mock" } });
        continue;
      }
      try {
        const status = await client.getTxStatus(id);
        verifiedTxs.push({
          ...info,
          onChain: {
            status: status.status,
            ledger: status.ledger,
            resultCode: status.resultCode,
            message: status.message,
          },
          explorerUrl: `https://stellar.expert/explorer/${network}/tx/${id}`,
        });
      } catch (e) {
        verifiedTxs.push({
          ...info,
          onChain: {
            status: "FAILED",
            message: e instanceof Error ? e.message : "unknown",
          },
          explorerUrl: `https://stellar.expert/explorer/${network}/tx/${id}`,
        });
      }
    }

    // Sort: verified on-chain first, then by timestamp desc
    verifiedTxs.sort((a, b) => {
      const aVerified = a.onChain?.status === "SUCCESS" ? 1 : 0;
      const bVerified = b.onChain?.status === "SUCCESS" ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({
      network,
      escrowWalletId: escrowConfigured ? escrowWalletId : null,
      escrowBalance,
      txs: verifiedTxs,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] /api/proof GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}