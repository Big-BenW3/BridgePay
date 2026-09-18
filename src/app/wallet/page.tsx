"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePollar } from "@pollar/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <div className="min-h-screen bg-[#f1f5f9] grid place-items-center p-6">
        <Card className="max-w-[400px] text-center">
          <p className="text-sm text-[#6b7589]">Connect wallet in <Link href="/onboarding" className="text-[#862fe7] underline">onboarding</Link>.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="mx-auto max-w-[880px] px-6 py-8">
        <Link href="/app" className="text-sm text-[#862fe7] hover:underline">← Dashboard</Link>
        <div className="fluid-enter">
          <h1 className="font-display text-[26px] font-semibold mt-4">Wallet</h1>
          <p className="text-sm text-[#6b7589]">Pollar on Stellar • fees sponsored</p>
        </div>

        <div className="fluid-enter-stagger">
          <Card className="mt-6 hover">
            <div className="core p-6">
              <p className="font-mono text-xs break-all bg-white border border-[#d8e0ea] rounded-[12px] px-3 py-3">{wallet.address}</p>
              <div className="mt-4 flex gap-3 flex-wrap">
                {balances.length ? balances.map((b) => <span key={b.code ?? b.asset} className="text-sm font-medium px-3 py-1 rounded-full bg-[#f1f5f9] border border-[#d8e0ea]">{b.code ?? b.asset}: {b.balance}</span>) : <span className="text-xs text-[#6b7589]">Loading balances…</span>}
                <span className="text-sm px-3 py-1 rounded-full bg-[#ebdafd] text-[#5f259e]">Escrow pending ${pending.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => openWalletBalanceModal()}>Balances</Button>
                <Button size="sm" variant="ghost" onClick={() => openRampModal()}>Ramp</Button>
                <Button size="sm" variant="ghost" onClick={() => refreshWalletBalance()}>Refresh</Button>
                {txHistory && <Button size="sm" variant="mint" onClick={() => openTxHistoryModal()}>History</Button>}
              </div>
            </div>
          </Card>

          <Card className="mt-4 hover">
            <div className="core p-6">
              <p className="text-sm font-semibold">Cash-out</p>
              <p className="text-xs text-[#6b7589] mt-1">USDC → NGN via off-ramp (roadmap). On-ramp BOB→USDC is live.</p>
              <p className="text-xs text-[#6b7589] mt-3">Honest scope — P2P / Yellow Card → NIBSS is documented, not wired for hackathon.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}