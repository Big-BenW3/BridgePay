"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
          <div className="w-8 h-8 rounded-full border-[3px] border-[#d8e0ea] border-t-[#862fe7] animate-spin" />
          <p className="text-sm text-[#6b7589]">Loading audit log…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1100px] px-6 py-6">
        <Link href="/app" className="text-sm text-[#862fe7] hover:underline">← Dashboard</Link>
        <div className="fluid-enter">
          <h1 className="font-display text-[28px] font-semibold mt-3">Audit log — judging walkthrough</h1>
          <p className="text-sm text-[#6b7589]">Every SDK call + state transition timestamped. This is your <b>submission proof</b>.</p>
        </div>

        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 mt-6 fluid-enter-stagger">
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#111827]">SDK & state log (newest first)</p>
            {logs.length === 0 ? <Card className="text-sm text-[#6b7589]">No activity yet. Create a job and fund escrow.</Card> :
              logs.map((l) => (
                <Card key={l.id} className="py-4 hover">
                  <div className="core p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{l.action} <span className="font-normal text-[#6b7589]">— {l.payload && typeof l.payload === "object" && "detail" in l.payload ? String(l.payload.detail) : ""}</span></p>
                        <p className="font-mono text-[11px] text-[#6b7589]">{new Date(l.timestamp).toLocaleString()} • {l.payload && typeof l.payload === "object" && "txId" in l.payload ? String(l.payload.txId) : l.payload && typeof l.payload === "object" && "walletId" in l.payload ? String(l.payload.walletId) : l.payload && typeof l.payload === "object" && "jobId" in l.payload ? String(l.payload.jobId) : ""}</p>
                        {l.payload && <pre className="mt-2 text-[11px] bg-[#f1f5f9] border border-[#d8e0ea] rounded-[8px] p-2 overflow-auto max-h-[120px]">{JSON.stringify(l.payload, null, 2)}</pre>}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#ebdafd] text-[#5f259e] font-bold whitespace-nowrap">{String(l.action).includes("fund") || String(l.action).includes("release") ? "SDK" : "STATE"}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          <div className="space-y-4">
            <Card className="bg-[#111827] text-white hover">
              <div className="core p-6">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#ad6df4]">For submission</p>
                <p className="text-sm text-[#cbd5e1] mt-2">Screen-record the full journey: wallet → fund → submit → approve → release → wallet balance update. Screenshot this log + escrow tx ids.</p>
                <div className="mt-3 flex gap-2"><Button size="sm" variant="mint" onClick={() => { navigator.clipboard.writeText(JSON.stringify(logs, null, 2)); alert("Copied log JSON"); }}>Copy JSON</Button><Button size="sm" variant="ghost" className="!text-white !border-white/20" onClick={async () => { await fetch("/api/reset", { method: "POST" }); location.reload(); }}>Reset demo</Button></div>
              </div>
            </Card>
            <Card className="hover">
              <div className="core p-6">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#862fe7]">Jobs & transitions</p>
                {jobs.length === 0 ? <p className="text-sm text-[#6b7589] mt-2">No jobs.</p> :
                  jobs.map((j) => (
                    <div key={j.id} className="py-2 border-b border-[#f1f5f9] last:border-0">
                      <p className="text-sm font-medium">{j.title} <span className="text-xs text-[#6b7589]">({j.status})</span></p>
                      <p className="font-mono text-[11px] text-[#6b7589]">{j.id} • fund {j.transactions.find(t => t.type === "fund")?.id ?? "—"} • release {j.transactions.find(t => t.type === "release")?.id ?? "—"}</p>
                    </div>
                  ))}
              </div>
            </Card>
            <Card className="bg-[#d6fcf4] hover">
              <div className="core p-6">
                <p className="text-xs font-bold tracking-[0.1em] uppercase">Environment</p>
                <p className="font-mono text-xs mt-2">DATABASE_URL: Neon Postgres (serverless)</p>
                <p className="font-mono text-xs">Pollar network: testnet</p>
                <p className="font-mono text-xs">Escrow: auto-created Option 1 via SDK</p>
                <p className="text-xs text-[#3f4654] mt-2">Data persisted via /api/state → Prisma → Neon.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}