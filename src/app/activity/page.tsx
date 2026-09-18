"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getState, type JobState, type LogState } from "@/lib/api";

export default function ActivityPage() {
  const [logs, setLogs] = useState<LogState[]>([]);
  const [jobs, setJobs] = useState<JobState[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const state = await getState();
      setLogs(state.logs);
      setJobs(state.jobs);
    } catch { setLogs([]); setJobs([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); const iv = setInterval(load, 800); return () => clearInterval(iv); }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[var(--color-mist)] border-t-[var(--color-ember-orange)] animate-spin" />
          <p className="text-[14px] text-[var(--color-slate)]">Loading audit log…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <Link href="/app" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Dashboard</Link>

        <header className="mb-10">
          <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
            Audit log — judging walkthrough
          </h1>
          <p className="mt-2 text-[18px] leading-[1.25] text-[var(--color-steel)]">
            Every SDK call + state transition timestamped. This is your <b>submission proof</b>.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8">
          {/* Main log */}
          <section>
            <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-6">
              SDK & state log (newest first)
            </p>
            {logs.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-[14px] text-[var(--color-steel)]">No activity yet. Create a job and fund escrow.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((l) => (
                  <div key={l.id} className="data-card p-4 hover:bg-[var(--color-fog)] transition-colors duration-150">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-polysans text-[15px] font-medium text-[var(--color-graphite)]">
                          {l.action}
                          {l.payload && typeof l.payload === "object" && "detail" in l.payload && (
                            <span className="font-normal text-[var(--color-slate)] ml-2">— {String(l.payload.detail)}</span>
                          )}
                        </p>
                        <p className="font-mono text-[11px] text-[var(--color-slate)] mt-1">
                          {new Date(l.timestamp).toLocaleString()}
                          {l.payload && typeof l.payload === "object" && "txId" in l.payload && (
                            <> · <span className="font-mono text-[11px] text-[var(--color-ember-orange)]">{String(l.payload.txId).slice(0, 20)}…</span></>
                          )}
                          {l.payload && typeof l.payload === "object" && "walletId" in l.payload && (
                            <> · {String(l.payload.walletId).slice(0, 12)}…</>
                          )}
                          {l.payload && typeof l.payload === "object" && "jobId" in l.payload && (
                            <> · {String(l.payload.jobId)}</>
                          )}
                        </p>
                        {l.payload && (
                          <pre className="mt-3 text-[11px] bg-[var(--surface-fog-surface)] border border-[var(--color-mist)] rounded-[var(--radius-cards)] p-2 overflow-auto max-h-[120px]">
                            {JSON.stringify(l.payload, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className={`tag ${String(l.action).includes("fund") || String(l.action).includes("release") ? "tag-ember" : "tag-brass"} whitespace-nowrap shrink-0`}>
                        {String(l.action).includes("fund") || String(l.action).includes("release") ? "SDK" : "STATE"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="data-card p-6">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
                For submission
              </p>
              <p className="text-[14px] text-[var(--color-steel)] mb-4">
                Screen-record the full journey: wallet → fund → submit → approve → release → wallet balance update. Screenshot this log + escrow tx ids.
              </p>
              <div className="flex flex-col gap-2">
                <button className="btn-primary" onClick={() => { navigator.clipboard.writeText(JSON.stringify(logs, null, 2)); alert("Copied log JSON"); }}>
                  Copy JSON
                </button>
                <Link href="/proof"><button className="btn-primary">On-chain proof</button></Link>
                <button className="btn-ghost" onClick={async () => { await fetch("/api/reset", { method: "POST" }); location.reload(); }}>
                  Reset demo
                </button>
              </div>
            </div>

            <div className="data-card p-6">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
                Jobs & transitions
              </p>
              {jobs.length === 0 ? (
                <p className="text-[14px] text-[var(--color-slate)]">No jobs.</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((j) => (
                    <div key={j.id} className="py-3 border-b border-[var(--color-mist)] last:border-0">
                      <p className="font-polysans text-[15px] font-medium text-[var(--color-graphite)]">
                        {j.title} <span className="font-normal text-[var(--color-slate)]">({j.status})</span>
                      </p>
                      <p className="font-mono text-[11px] text-[var(--color-slate)] mt-1">
                        {j.id} · fund {j.transactions.find(t => t.type === "fund")?.id ?? "—"} · release {j.transactions.find(t => t.type === "release")?.id ?? "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="data-card p-6 bg-[var(--surface-ivory-surface)]">
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-3">
                Environment
              </p>
              <dl className="space-y-2 text-[13px] font-mono text-[var(--color-slate)]">
                <div className="flex justify-between"><dt>Database</dt><dd>Neon Postgres (serverless)</dd></div>
                <div className="flex justify-between"><dt>Network</dt><dd>Stellar testnet</dd></div>
                <div className="flex justify-between"><dt>Escrow</dt><dd>Dashboard-configured G… address</dd></div>
                <div className="flex justify-between"><dt>Persistence</dt><dd>/api/state → Prisma → Neon</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}