"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePollar } from "@pollar/react";
import { getState, type JobState } from "@/lib/api";

export default function WalletPage() {
  const { wallet, isAuthenticated, walletBalance, refreshWalletBalance, openWalletBalanceModal, openRampModal, txHistory, openTxHistoryModal } = usePollar();
  const [jobs, setJobs] = useState<JobState[]>([]);

  useEffect(() => {
    getState().then((s) => { setJobs(s.jobs); }).catch(() => { setJobs([]); });
  }, []);
  useEffect(() => { if (isAuthenticated) refreshWalletBalance(); }, [isAuthenticated, refreshWalletBalance]);

  const pending = jobs.filter((j) => ["funded", "in_progress"].includes(j.status)).reduce((a, j) => a + Number(j.amountBOB) * 0.152, 0);
  const balances = ((walletBalance as unknown as { data?: { balances?: { code?: string; asset?: string; balance: string }[] } })?.data?.balances ?? []).slice(0, 3);

  if (!isAuthenticated || !wallet) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="card text-center max-w-[400px] w-full">
          <p className="text-[14px] text-[var(--color-steel)]">Connect wallet in <Link href="/onboarding" className="link-ember font-polysans">onboarding</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[880px] px-6 py-10">
        <Link href="/app" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Dashboard</Link>

        <div className="mb-10">
          <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
            Wallet
          </h1>
          <p className="mt-2 text-[18px] leading-[1.25] text-[var(--color-steel)]">
            Pollar on Stellar · fees sponsored
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="data-card p-6 mb-8">
              <p className="font-mono text-[13px] bg-[var(--surface-page-canvas)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] px-3 py-3 break-all mb-4">
                {wallet.address}
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                {balances.length ? balances.map((b) => (
                  <span key={b.code ?? b.asset} className="tag tag-brass text-[13px] font-medium">
                    {b.code ?? b.asset}: {b.balance}
                  </span>
                )) : (
                  <span className="text-[13px] text-[var(--color-slate)]">Loading balances…</span>
                )}
                <span className="tag tag-ember">Escrow pending ${pending.toFixed(2)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="btn-primary text-[13px] px-4 py-2" onClick={() => openWalletBalanceModal()}>Balances</button>
                <button className="btn-ghost text-[13px] px-4 py-2" onClick={() => openRampModal()}>Ramp</button>
                <button className="btn-ghost text-[13px] px-4 py-2" onClick={() => refreshWalletBalance()}>Refresh</button>
                {txHistory && <button className="btn-primary text-[13px] px-4 py-2" onClick={() => openTxHistoryModal()}>History</button>}
              </div>
            </div>

            <div className="data-card p-6">
              <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mb-2">Cash-out</p>
              <p className="text-[14px] text-[var(--color-steel)] mb-2">USDC → NGN via off-ramp (roadmap). On-ramp BOB→USDC is live.</p>
              <p className="text-[13px] text-[var(--color-slate)]">Honest scope — P2P / Yellow Card → NIBSS is documented, not wired for hackathon.</p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="data-card p-6">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
                Quick actions
              </p>
              <div className="space-y-3">
                <button className="btn-ghost w-full justify-start text-left px-0" onClick={() => openRampModal()}>Add funds (BOB)</button>
                <button className="btn-ghost w-full justify-start text-left px-0" onClick={() => openWalletBalanceModal()}>View all balances</button>
                {txHistory && <button className="btn-ghost w-full justify-start text-left px-0" onClick={() => openTxHistoryModal()}>Transaction history</button>}
                <button className="btn-ghost w-full justify-start text-left px-0" onClick={() => refreshWalletBalance()}>Refresh balance</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}