"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/Badge";
import { getState, upsertJob, pushLog, type JobState } from "@/lib/api";

const USDC_ISSUER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { wallet, isAuthenticated, runTx, openRampModal, enabledAssets } = usePollar();
  const [job, setJob] = useState<JobState | null>(null);
  const [releasing, setReleasing] = useState(false);
  const [dest, setDest] = useState("");

  useEffect(() => setDest(wallet?.address ?? ""), [wallet]);
  const load = async () => {
    try {
      const state = await getState();
      const found = state.jobs.find((x) => x.id === id);
      setJob(found ?? null);
    } catch {
      setJob(null);
    }
  };
  useEffect(() => { load(); const iv = setInterval(load, 800); return () => clearInterval(iv); }, [id]);

  if (!job) return <div className="min-h-screen grid place-items-center p-8"><Card>Not found — <Link href="/app" className="text-[#862fe7] underline">back</Link></Card></div>;

  const fundMock = async () => {
    const updated: JobState = { ...job, status: "funded", escrowWalletId: "escrow_" + Math.random().toString(36).slice(2, 6), transactions: [...job.transactions, { id: "local_" + Date.now(), amount: job.amountBOB, currency: "BOB", type: "fund", timestamp: new Date().toISOString() }] };
    await upsertJob(updated);
    await pushLog("funded", `BOB ${job.amountBOB}`, { jobId: job.id });
    setJob(updated);
  };
  const setMilestone = async (mid: string, status: "submitted" | "approved") => {
    const milestones = job.milestones.map((m) => m.id === mid ? { ...m, status } : m);
    const allApproved = milestones.every((m) => m.status === "approved");
    const updated: JobState = { ...job, milestones, status: allApproved ? "approved" : status === "submitted" ? "in_progress" : job.status };
    await upsertJob(updated);
    await pushLog(status, mid, { jobId: job.id });
    setJob(updated);
  };
  const release = async () => {
    if (job.status !== "approved") return alert("Approve all first");
    if (!isAuthenticated) return alert("Connect Pollar first");
    if (!dest.startsWith("G")) return alert("Enter G… address");
    setReleasing(true);
    try {
      const enabled = (enabledAssets as unknown as { data?: { assets?: { code: string; issuer: string }[] } })?.data?.assets?.find((a) => a.code === "USDC");
      const asset = enabled ? { code: "USDC", issuer: enabled.issuer } : { code: "USDC", issuer: USDC_ISSUER };
      const o = await runTx("payment", { destination: dest, amount: (Number(job.amountBOB) * 0.152).toFixed(2), asset: { type: "credit_alphanum4", code: asset.code, issuer: asset.issuer } } as never) as unknown as Record<string, string>;
      const hash = o.hash ?? o.txHash ?? o.id ?? Date.now().toString();
      const updated: JobState = { ...job, status: "released", transactions: [...job.transactions, { id: hash, pollarTxId: hash, amount: (Number(job.amountBOB) * 0.152).toFixed(2), currency: "USDC", type: "release", timestamp: new Date().toISOString() }] };
      await upsertJob(updated);
      await pushLog("released", hash, { jobId: job.id });
      setJob(updated);
      setTimeout(() => { const c = { ...updated, status: "closed" as const }; upsertJob(c); setJob(c); setReleasing(false); }, 800);
    } catch (e) { alert(String(e)); setReleasing(false); }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="mx-auto max-w-[880px] px-6 py-6">
        <Link href="/app" className="text-sm text-[#862fe7] hover:underline">← Dashboard</Link>
        <div className="mt-4 flex flex-wrap gap-4 items-start justify-between">
          <div className="fluid-enter">
            <div className="flex items-center gap-3"><h1 className="font-display text-[22px] font-semibold">{job.title}</h1><StatusPill status={job.status} /></div>
            <p className="text-sm text-[#6b7589] mt-1 max-w-[560px]">{job.description}</p>
          </div>
          <div className="fluid-enter-fast">
            <Card className="min-w-[280px] p-5 hover">
              <div className="core p-5">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#862fe7]">BOB {job.amountBOB} <span className="text-[#6b7589] font-normal">≈ USDC {(Number(job.amountBOB) * 0.152).toFixed(2)}</span></p>
                {job.status === "open" && <div className="mt-3 space-y-2"><Button size="sm" className="w-full" onClick={() => openRampModal()}>Fund via Ramp →</Button><Button size="sm" variant="ghost" className="w-full" onClick={fundMock}>Mock fund</Button></div>}
                {job.status === "approved" && <div className="mt-3 space-y-2"><input value={dest} onChange={e => setDest(e.target.value)} placeholder="G… freelancer" className="w-full font-mono text-xs border border-[#d8e0ea] rounded-[10px] px-3 py-2" /><Button size="sm" className="w-full" onClick={release} disabled={releasing}>{releasing ? "Releasing…" : "Release →"}</Button></div>}
                {(job.status === "released" || job.status === "closed") && <p className="mt-3 text-xs font-mono bg-[#111827] text-white rounded-full px-3 py-1 truncate">{job.transactions.find(t => t.type === "release")?.id ?? "—"}</p>}
                {job.status === "funded" && <p className="mt-3 text-xs px-3 py-1 rounded-full bg-[#d6fcf4] text-[#065f46] inline-block">Funds locked</p>}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 fluid-enter-stagger">
          <h2 className="text-xs font-bold tracking-[0.1em] uppercase">Milestones</h2>
          <div className="mt-3 space-y-3">
            {job.milestones.map((m) => (
              <Card key={m.id} className="flex items-center justify-between py-4 hover">
                <div className="core p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{m.title}</p><StatusPill status={m.status} /></div>
                  {m.status === "pending" && <Button size="sm" variant="mint" onClick={() => setMilestone(m.id, "submitted")}>Submit</Button>}
                  {m.status === "submitted" && <Button size="sm" onClick={() => setMilestone(m.id, "approved")}>Approve</Button>}
                  {m.status === "approved" && <span className="text-xs font-bold text-emerald-600">✓</span>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}