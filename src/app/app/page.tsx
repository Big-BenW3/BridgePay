"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    if (!user || user.role !== "client") return;
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
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[var(--color-mist)] border-t-[var(--color-ember-orange)] animate-spin" />
          <p className="text-[14px] text-[var(--color-slate)]">Loading your escrow…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="card text-center max-w-[360px] w-full">
          <h2 className="font-polysans text-[20px] font-medium text-[var(--color-graphite)]">No wallet yet</h2>
          <p className="text-[14px] text-[var(--color-steel)] mt-2">Connect in onboarding first.</p>
          <Link href="/onboarding" className="inline-block mt-6"><button className="btn-primary">Go to onboarding</button></Link>
        </div>
      </div>
    );
  }

  const filtered = filter === "all" ? jobs : jobs.filter((j) => filter === "closed" ? ["released", "closed"].includes(j.status) : j.status === filter);

  const statusCounts = {
    total: jobs.length,
    funded: jobs.filter((j) => ["funded", "in_progress", "approved"].includes(j.status)).length,
    released: jobs.filter((j) => ["released", "closed"].includes(j.status)).length,
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-[var(--color-mist)] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bridgepay-logo.png" alt="BridgePay" width={1408} height={676} className="h-8 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3">
            <span className="tag tag-brass text-[12px] px-2 py-0.5">{user.role}</span>
            <Link href="/wallet"><button className="btn-ghost text-[14px] px-4 py-2">Wallet</button></Link>
            <Link href="/proof"><button className="btn-ghost text-[14px] px-4 py-2">Proof</button></Link>
            <Link href="/onboarding"><button className="btn-ghost text-[14px] px-4 py-2">Switch role</button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6">
        {/* Section 1: Dashboard Header - White canvas */}
        <section className="pt-20 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)]">
                Dashboard · {user.role} · {user.country}
              </p>
              <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium mt-2">
                Escrow that moves at Stellar speed.
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-steel)] max-w-[560px]">
                {user.role === "client"
                  ? "Fund once, release on approval. No wire waiting."
                  : "Submit work, get USDC the moment client approves."}
                <span className="font-medium"> Sponsored fees · Pollar wallet</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user.role === "client" && (
                <Link href="/jobs/new"><button className="btn-primary">+ New job</button></Link>
              )}
              <Link href="/wallet"><button className="btn-ghost">Wallet</button></Link>
              {user.role === "client" && (
                <button className="btn-ghost" onClick={handleSeedDemo}>Seed demo job</button>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Stats - Ash surface band */}
        <section className="bg-[var(--surface-ash-surface)] py-16">
          <div className="grid grid-cols-3 gap-[var(--element-gap)]">
            {[
              { k: "Total", v: statusCounts.total },
              { k: "Funded", v: statusCounts.funded },
              { k: "Released", v: statusCounts.released },
            ].map((s) => (
              <div key={s.k} className="data-card p-6 text-center">
                <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)]">
                  {s.k}
                </p>
                <p className="font-polysans text-[44px] leading-[0.91] tracking-[-0.88px] text-[var(--color-graphite)] font-medium mt-2">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Jobs - White canvas */}
        <section className="py-16">
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "open", "funded", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium capitalize border transition-colors duration-150 ${
                  filter === s
                    ? "bg-[var(--color-graphite)] text-white border-[var(--color-graphite)]"
                    : "bg-white text-[var(--color-slate)] border-[var(--color-mist)] hover:border-[var(--color-graphite)]"
                }`}
              >
                {s}
              </button>
            ))}
            <Link href="/activity" className="ml-auto self-center link-ember font-polysans text-[13px]">
              Audit log
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-[14px] text-[var(--color-steel)]">No jobs in {filter}.</p>
              {user.role === "client" && (
                <Link href="/jobs/new" className="inline-block mt-6"><button className="btn-primary">Create one</button></Link>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-[var(--element-gap)]">
              {filtered.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="data-card p-6 hover:bg-[var(--color-fog)] transition-colors duration-150">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] line-clamp-1">{job.title}</h3>
                    <span className={`status-pill status-${job.status}`}>{job.status}</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-slate)] mt-1">BOB {job.amountBOB} · {job.milestones.length} milestones</p>
                  <div className="mt-4 h-1.5 rounded-full bg-[var(--color-mist)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-ember-orange)] transition-all duration-300 ease-out"
                      style={{
                        width: `${(job.milestones.filter((m) => m.status === "approved").length / Math.max(1, job.milestones.length)) * 100}%`,
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}