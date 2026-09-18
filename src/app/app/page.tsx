"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/Badge";
import { getState, upsertJob, pushLog, type JobState, type UserState } from "@/lib/api";

export default function Dashboard() {
  const [user, setUser] = useState<UserState>(null);
  const [jobs, setJobs] = useState<JobState[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "funded" | "closed">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const state = await getState();
      setUser(state.user);
      setJobs(state.jobs);
    } catch {
      setUser(null);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleSeedDemo = async () => {
    if (!user || user.role !== "client") {
      alert("Switch to Client role in /onboarding to seed demo (demo guard)");
      return;
    }
    const demoJob: JobState = {
      id: "demo-job-1",
      clientId: user.id,
      title: "Landing page for NGO",
      description: "3-page marketing site + CMS, responsive, handover docs.",
      amountBOB: "1200",
      amountUSDC: "182.40",
      status: "open",
      milestones: [
        { id: "m1", title: "Wireframes & design", status: "pending", order: 0 },
        { id: "m2", title: "Frontend build", status: "pending", order: 1 },
        { id: "m3", title: "QA & deploy", status: "pending", order: 2 },
      ],
      transactions: [],
      escrowWalletId: undefined,
      yieldEnabled: false,
      createdAt: new Date().toISOString(),
    };
    await upsertJob(demoJob);
    await pushLog("job_created", `Demo job created BOB 1200`, { jobId: demoJob.id });
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f1f5f9] p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#d8e0ea] border-t-[#862fe7] animate-spin" />
          <p className="text-sm text-[#6b7589]">Loading your escrow…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f1f5f9] p-6">
        <Card className="max-w-[360px] w-full text-center">
          <h2 className="font-display text-[20px] font-semibold">No wallet yet</h2>
          <p className="text-sm text-[#6b7589] mt-2">Connect in onboarding first.</p>
          <Link href="/onboarding" className="inline-block mt-4"><Button>Go to onboarding →</Button></Link>
        </Card>
      </div>
    );
  }

  const filtered = filter === "all" ? jobs : jobs.filter((j) => filter === "closed" ? ["released", "closed"].includes(j.status) : j.status === filter);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-10 bg-white border-b border-[#d8e0ea]">
        <div className="mx-auto max-w-[1100px] px-6 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm"><span className="w-7 h-7 rounded-[8px] bg-[#862fe7] grid place-items-center text-white text-xs">◆</span> BridgePay</Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-medium px-2.5 py-1 rounded-full bg-[#ebdafd] text-[#5f259e]">{user.role}</span>
            <Link href="/wallet"><Button size="sm" variant="ghost">Wallet</Button></Link>
            <Link href="/onboarding"><Button size="sm" variant="dark">Switch</Button></Link>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#d8e0ea]">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="fluid-enter">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#862fe7]">Dashboard • {user.role} • {user.country}</p>
            <h1 className="font-display text-[32px] font-semibold tracking-[-0.8px] mt-1">Escrow that moves at Stellar speed.</h1>
            <p className="text-sm text-[#6b7589] mt-2 max-w-[560px]">{user.role === "client" ? "Fund once, release on approval. No wire waiting." : "Submit work, get USDC the moment client approves."} • Sponsored fees • Pollar wallet</p>
          </div>
          <div className="flex gap-3">
            {user.role === "client" && (
              <Link href="/jobs/new"><Button>+ New job</Button></Link>
            )}
            <Link href="/wallet"><Button variant="ghost">Wallet</Button></Link>
            {user.role === "client" && (
              <Button variant="mint" onClick={handleSeedDemo}>Seed demo job</Button>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-[1100px] px-6 pb-6 grid grid-cols-3 gap-3 fluid-enter-stagger">
          {[
            { k: "Total", v: jobs.length },
            { k: "Funded", v: jobs.filter((j) => ["funded", "in_progress", "approved"].includes(j.status)).length },
            { k: "Released", v: jobs.filter((j) => ["released", "closed"].includes(j.status)).length },
          ].map((s) => (
            <div key={s.k} className="rounded-[16px] bg-[#f1f5f9] border border-[#d8e0ea] px-4 py-3">
              <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7589]">{s.k}</p>
              <p className="font-display text-[20px] font-semibold">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="mt-6 flex gap-2">
          {(["all", "open", "funded", "closed"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-[background-color,border-color] duration-150 ease-[var(--ease-out)] ${filter === s ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6b7589] border-[#d8e0ea] hover:border-[#111827]"}`}>{s}</button>
          ))}
          <Link href="/activity" className="ml-auto text-xs font-semibold text-[#6b7589] hover:text-[#111827] self-center">Audit →</Link>
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-6 text-center py-10">
            <p className="text-sm text-[#6b7589]">No jobs in {filter}.</p>
            {user.role === "client" && (
              <Link href="/jobs/new" className="inline-block mt-3"><Button size="sm">Create one</Button></Link>
            )}
          </Card>
        ) : (
          <div className="z-cascade mt-6 fluid-enter-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="group">
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-[15px] line-clamp-1">{job.title}</h3><StatusPill status={job.status} /></div>
                  <p className="text-xs text-[#6b7589] mt-1">BOB {job.amountBOB} • {job.milestones.length} milestones</p>
                  <div className="mt-3 h-1 rounded-full bg-[#f1f5f9] overflow-hidden"><div className="h-full bg-[#862fe7] transition-[width] duration-300 ease-[var(--ease-out)]" style={{ width: `${(job.milestones.filter((m) => m.status === "approved").length / Math.max(1, job.milestones.length)) * 100}%` }} /></div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}