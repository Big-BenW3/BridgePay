"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProof } from "@/lib/api";

type ProofTx = {
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
};

type ProofState = {
  network: string;
  escrowWalletId: string | null;
  escrowBalance: { asset: string; balance: string }[] | null;
  txs: ProofTx[];
  verifiedAt: string;
};

export default function ProofPage() {
  const [data, setData] = useState<ProofState | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const load = async () => {
    try {
      const proof = await getProof();
      setData(proof);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReverify = async () => {
    setVerifying(true);
    await load();
    setVerifying(false);
  };

  const copyJson = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert("Proof manifest copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[var(--color-mist)] border-t-[var(--color-ember-orange)] animate-spin" />
          <p className="text-[14px] text-[var(--color-slate)]">Verifying on-chain…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="card text-center max-w-[400px] w-full">
          <p className="text-[14px] text-[var(--color-steel)]">Failed to load proof data.</p>
        </div>
      </div>
    );
  }

  const realTxs = data.txs.filter((t) => t.onChain?.status !== "mock");
  const mockTxs = data.txs.filter((t) => t.onChain?.status === "mock");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <Link href="/activity" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Audit log</Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-2">
                On-chain verification
              </p>
              <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
                Proof of funds
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={handleReverify} disabled={verifying}>
                {verifying ? "Re-verifying…" : "Re-verify on-chain"}
              </button>
              <button className="btn-ghost" onClick={copyJson}>
                Copy JSON manifest
              </button>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-steel)] max-w-[640px]">
            Every release below is a real Stellar testnet transaction. Each hash is verified via Pollar&apos;s <code className="px-1 rounded bg-[var(--color-fog)] font-mono text-[13px]">getTxStatus</code> — SUCCESS means the payment was ledger-confirmed with sponsored fees.
            Mock entries (fund mocks) are labeled honestly.
          </p>
        </header>

        {/* Escrow Account Card */}
        {data.escrowWalletId && (
          <section className="mb-8">
            <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
              Escrow account
            </p>
            <div className="data-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="font-mono text-[14px] bg-[var(--surface-page-canvas)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] px-4 py-3 break-all mb-4">
                    {data.escrowWalletId}
                  </p>
                  <p className="text-[13px] text-[var(--color-slate)]">
                    Stellar {data.network === "testnet" ? "testnet" : "mainnet"} escrow wallet. Funds held non-custodially by Pollar KMS until all milestones approve.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {data.escrowBalance && data.escrowBalance.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.escrowBalance.map((b) => (
                        <span key={b.asset} className="tag tag-brass text-[13px] font-medium">
                          {b.asset}: {b.balance}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[13px] text-[var(--color-slate)]">No balances available</span>
                  )}
                  <a
                    href={`https://stellar.expert/explorer/${data.network}/account/${data.escrowWalletId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-ember font-polysans text-[13px] whitespace-nowrap"
                  >
                    View on stellar.expert →
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Verified Releases */}
        <section className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)]">
              Verified releases ({realTxs.length})
            </p>
            {realTxs.length === 0 && (
              <span className="text-[13px] text-[var(--color-slate)]">
                No real releases yet. Complete a job&apos;s milestones and release to produce a verified tx.
              </span>
            )}
          </div>

          {realTxs.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-[14px] text-[var(--color-steel)]">
                Fund a job via Ramp (or mock), submit milestones, approve all, then Release as the client.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {realTxs.map((tx) => (
                <div key={tx.id} className="data-card p-4 hover:bg-[var(--color-fog)] transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className={`status-pill status-${tx.onChain?.status === "SUCCESS" ? "approved" : tx.onChain?.status === "PENDING" ? "in_progress" : "pending"}`}>
                          {tx.onChain?.status === "SUCCESS" ? "✓ On-chain" : tx.onChain?.status === "PENDING" ? "⏳ Pending" : "✗ Failed"}
                        </span>
                        {tx.onChain?.ledger && (
                          <span className="font-mono text-[12px] text-[var(--color-slate)] px-2 py-0.5 bg-[var(--surface-page-canvas)] border border-[var(--color-mist)] rounded">
                            Ledger {tx.onChain.ledger}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[13px]">
                        <span className="font-mono text-[var(--color-graphite)] truncate max-w-[280px]" title={tx.id}>
                          {tx.id.slice(0, 16)}…{tx.id.slice(-8)}
                        </span>
                        <span className="text-[var(--color-steel)]">{tx.amount} {tx.currency}</span>
                        <span className="text-[var(--color-slate)]">{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="btn-ghost text-[12px] px-3 py-1.5"
                        onClick={() => navigator.clipboard.writeText(tx.id)}
                        title="Copy hash"
                      >
                        Copy
                      </button>
                      {tx.explorerUrl && (
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-[12px] px-3 py-1.5"
                        >
                          Explorer
                        </a>
                      )}
                    </div>
                  </div>
                  {tx.onChain?.resultCode && (
                    <p className="mt-2 font-mono text-[11px] text-[var(--color-slate)]">
                      resultCode: {tx.onChain.resultCode}
                      {tx.onChain?.message && <span className="ml-2"> — {tx.onChain.message}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mock transactions (honest labeling) */}
          {mockTxs.length > 0 && (
            <details className="mt-8">
              <summary className="font-polysans text-[13px] font-medium text-[var(--color-ember-orange)] cursor-pointer">
                Mock transactions ({mockTxs.length}) — not on-chain
              </summary>
              <div className="space-y-2 mt-4">
                {mockTxs.map((tx) => (
                  <div key={tx.id} className="card p-4 bg-[var(--surface-ivory-surface)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                      <div>
                        <span className="status-pill status-pending">Mock</span>
                        <span className="font-mono text-[var(--color-slate)] ml-2 truncate max-w-[280px]">{tx.id}</span>
                      </div>
                      <span className="text-[var(--color-steel)]">{tx.amount} {tx.currency}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-[var(--color-slate)]">
                      Created via mock fund/release. No on-chain proof exists. Use Ramp + real Release for verifiable txs.
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* JSON Manifest */}
          <details className="mt-8">
            <summary className="font-polysans text-[13px] font-medium text-[var(--color-ember-orange)] cursor-pointer">
              Raw proof manifest (JSON)
            </summary>
            <pre className="mt-4 text-[11px] bg-[var(--surface-fog-surface)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] p-4 overflow-auto max-h-[300px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </section>

        <footer className="border-t border-[var(--color-mist)] pt-6 text-center text-[13px] text-[var(--color-slate)]">
          <p>Network: <code className="px-1 rounded bg-[var(--color-fog)]">{data.network}</code> · Verified at {new Date(data.verifiedAt).toLocaleString()}</p>
        </footer>
      </div>
    </div>
  );
}