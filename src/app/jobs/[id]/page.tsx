"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import { getState, upsertJob, pushLog, type JobState, type UserState } from "@/lib/api";

const USDC_ISSUER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { wallet, isAuthenticated, runTx, openRampModal, enabledAssets } = usePollar();
  const [job, setJob] = useState<JobState | null>(null);
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [dest, setDest] = useState("");

  useEffect(() => setDest(wallet?.address ?? ""), [wallet]);
  const load = useCallback(async () => {
    try {
      const state = await getState();
      const found = state.jobs.find((x) => x.id === id);
      setJob(found ?? null);
      setUser(state.user);
    } catch {
      setJob(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => { load(); const iv = setInterval(load, 800); return () => clearInterval(iv); }, [load]);

  if (loading) return (
    <div className="min-h-screen grid place-items-center bg-white p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-[3px] border-[var(--color-mist)] border-t-[var(--color-ember-orange)] animate-spin" />
        <p className="text-[14px] text-[var(--color-slate)]">Loading your escrow…</p>
      </div>
    </div>
  );
  if (!job) return (
    <div className="min-h-screen grid place-items-center bg-white p-6">
      <div className="card text-center max-w-[360px] w-full">
        <p className="text-[14px] text-[var(--color-steel)]">Not found</p>
        <Link href="/app" className="inline-block mt-4 link-ember font-polysans">← Back to dashboard</Link>
      </div>
    </div>
  );

  // Role gate: the job creator (client) approves + releases but can never submit;
  // anyone else authenticated (freelancer) submits but can never approve.
  const isCreator = isAuthenticated && !!user && user.id === job.clientId && user.role === "client";
  const canSubmit = isAuthenticated && !isCreator;
  const canApprove = isCreator;

  const fundMock = async () => {
    const updated: JobState = { ...job, status: "funded", escrowWalletId: "escrow_" + Math.random().toString(36).slice(2, 6), transactions: [...job.transactions, { id: "local_" + Date.now(), amount: job.amountBOB, currency: "BOB", type: "fund", timestamp: new Date().toISOString() }] };
    await upsertJob(updated);
    await pushLog("funded", `BOB ${job.amountBOB}`, { jobId: job.id });
    setJob(updated);
  };
  const setMilestone = async (mid: string, status: "submitted" | "approved") => {
    if (status === "submitted" && !canSubmit) return alert("Only the freelancer can submit — the creator can't.");
    if (status === "approved" && !canApprove) return alert("Only the job creator can approve.");
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
    if (!isCreator) return alert("Only the job creator can release.");
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

  const usdcAmount = (Number(job.amountBOB) * 0.152).toFixed(2);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[880px] px-6 py-10">
        <Link href="/app" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Dashboard</Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="font-polysans text-[22px] font-medium text-[var(--color-graphite)]">{job.title}</h1>
            <span className={`status-pill status-${job.status}`}>{job.status}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-steel)] max-w-[560px]">{job.description}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main content */}
          <div>
            {/* Escrow panel */}
            <div className="data-card p-6 mb-8">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-3">
                BOB {job.amountBOB} <span className="font-normal text-[var(--color-slate)]">≈ USDC {usdcAmount}</span>
              </p>

              {job.status === "open" && (
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary" onClick={() => openRampModal()}>Fund via Ramp</button>
                  <button className="btn-ghost" onClick={fundMock}>Mock fund</button>
                </div>
              )}

              {job.status === "approved" && isCreator && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <input
                    value={dest}
                    onChange={e => setDest(e.target.value)}
                    placeholder="G… freelancer address"
                    className="flex-1 font-mono text-[13px]"
                  />
                  <button className="btn-primary whitespace-nowrap" onClick={release} disabled={releasing}>
                    {releasing ? "Releasing…" : "Release"}
                  </button>
                </div>
              )}

              {job.status === "approved" && !isCreator && (
                <p className="mt-4 text-[13px] text-[var(--color-slate)]">Waiting for the client to release.</p>
              )}

              {(job.status === "released" || job.status === "closed") && (
                <p className="mt-4 font-mono text-[13px] bg-[var(--color-graphite)] text-white rounded-full px-3 py-1.5 inline-block truncate max-w-xs">
                  {job.transactions.find(t => t.type === "release")?.id ?? "—"}
                </p>
              )}

              {job.status === "funded" && (
                <span className="mt-4 inline-block tag tag-brass">Funds locked</span>
              )}
            </div>

            {/* Milestones */}
            <div>
              <h2 className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
                Milestones
              </h2>
              <div className="space-y-3">
                {job.milestones.map((m) => (
                  <div key={m.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="w-8 h-8 rounded-full bg-[var(--surface-ash-surface)] grid place-items-center font-polysans text-[13px] font-medium text-[var(--color-ember-orange)]">
                        {m.order + 1}
                      </span>
                      <div>
                        <p className="font-polysans text-[15px] font-medium text-[var(--color-graphite)]">{m.title}</p>
                        <span className={`status-pill status-${m.status} ml-2`}>{m.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.status === "pending" && canSubmit && (
                        <button className="btn-primary text-[13px] px-3 py-1.5" onClick={() => setMilestone(m.id, "submitted")}>Submit</button>
                      )}
                      {m.status === "pending" && isCreator && (
                        <span className="text-[13px] text-[var(--color-slate)]">Waiting for freelancer…</span>
                      )}
                      {m.status === "submitted" && canApprove && (
                        <button className="btn-primary text-[13px] px-3 py-1.5" onClick={() => setMilestone(m.id, "approved")}>Approve</button>
                      )}
                      {m.status === "submitted" && !isCreator && (
                        <span className="text-[13px] text-[var(--color-slate)]">Waiting for client approval…</span>
                      )}
                      {m.status === "approved" && (
                        <span className="text-[13px] font-medium text-[var(--color-ember-orange)]">✓ Approved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Escrow info */}
          <div className="lg:sticky lg:top-24">
            <div className="card p-6">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-3">
                Escrow
              </p>
              <p className="font-mono text-[13px] bg-[var(--surface-page-canvas)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] px-3 py-2.5 truncate mb-4">
                {job.escrowWalletId ?? "—"}
              </p>
              <p className="text-[13px] text-[var(--color-slate)] mb-4">
                Non-custodial Stellar escrow. Funds held until all milestones approve.
              </p>
              <div className="border-t border-[var(--color-mist)] pt-4">
                <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-2">
                  Transactions
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {job.transactions.length === 0 ? (
                    <p className="text-[13px] text-[var(--color-slate)]">No transactions yet</p>
                  ) : (
                    job.transactions.slice().reverse().map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-2 text-[13px]">
                        <div>
                          <p className="font-medium text-[var(--color-graphite)]">{t.type === "fund" ? "Funded" : "Released"}</p>
                          <p className="text-[var(--color-slate)]">{t.amount} {t.currency}</p>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--color-slate)] truncate max-w-[120px]">{t.id}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}