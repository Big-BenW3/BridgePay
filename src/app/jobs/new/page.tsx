"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getState, pushLog, upsertJob, type UserState, type JobState } from "@/lib/api";

export default function NewJobPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    getState().then((s) => setUser(s.user)).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);
  const [title, setTitle] = useState("Landing page for NGO");
  const [desc, setDesc] = useState("3-page marketing site + CMS, responsive, handover docs.");
  const [amount, setAmount] = useState("1200");
  const [milestones, setMilestones] = useState<string[]>(["Wireframes & design", "Frontend build", "QA & deploy"]);
  const [mInput, setMInput] = useState("");

  const create = async () => {
    if (!user || user.role !== "client") return;
    if (!title || !amount) return alert("Title & amount required");
    const job: JobState = {
      id: Math.random().toString(36).slice(2, 9),
      clientId: user.id,
      title, description: desc, amountBOB: amount,
      amountUSDC: (Number(amount) * 0.152).toFixed(2),
      status: "open",
      milestones: milestones.map((t, i) => ({ id: Math.random().toString(36).slice(2, 7), title: t, status: "pending", order: i })),
      transactions: [],
      yieldEnabled: false,
      createdAt: new Date().toISOString(),
    };
    await upsertJob(job);
    await pushLog("job_created", `Job ${job.id} created BOB ${amount}`, { jobId: job.id });
    router.push(`/jobs/${job.id}`);
  };

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[var(--color-mist)] border-t-[var(--color-ember-orange)] animate-spin" />
          <p className="text-[14px] text-[var(--color-slate)]">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen grid place-items-center bg-white p-6">
        <div className="card text-center max-w-[360px] w-full">
          <h2 className="font-polysans text-[20px] font-medium text-[var(--color-graphite)]">Clients only</h2>
          <p className="text-[14px] text-[var(--color-steel)] mt-2">Freelancers can&apos;t create jobs — they submit milestones on jobs clients post.</p>
          <Link href="/onboarding" className="inline-block mt-6"><button className="btn-primary">Switch role</button></Link>
        </div>
      </div>
    );
  }

  const usdcAmount = (Number(amount) * 0.152).toFixed(2);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[720px] px-6 py-12">
        <Link href="/app" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Dashboard</Link>

        <div className="mb-10">
          <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
            Create escrow job
          </h1>
          <p className="mt-3 text-[18px] leading-[1.25] text-[var(--color-steel)]">
            Fund in BOB via Pollar&apos;s live ramp → held in Stellar escrow. Milestones protect both sides.
          </p>
        </div>

        <div className="card">
          <div className="space-y-6">
            <div>
              <label className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] block mb-2">
                Job title
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Brand site build"
                className="w-full"
              />
            </div>

            <div>
              <label className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] block mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={3}
                className="w-full"
                placeholder="Describe the work…"
              />
            </div>

            <div>
              <label className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] block mb-2">
                Amount (BOB)
              </label>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
                className="w-full"
              />
              <p className="text-[13px] text-[var(--color-slate)] mt-2">
                Settles as USDC to freelancer on release. Conversion simulated at ~0.152 USDC/BOB for demo.
              </p>
              <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mt-1">
                ≈ USDC {usdcAmount}
              </p>
            </div>

            <div>
              <label className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] block mb-3">
                Milestones
              </label>
              <div className="space-y-2">
                {milestones.map((m, i) => (
                  <div key={i} className="card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--surface-ash-surface)] grid place-items-center font-polysans text-[13px] font-medium text-[var(--color-ember-orange)]">
                        {i + 1}
                      </span>
                      <span className="text-[14px] text-[var(--color-graphite)]">{m}</span>
                    </div>
                    <button
                      onClick={() => setMilestones(milestones.filter((_, x) => x !== i))}
                      className="text-[var(--color-slate)] hover:text-[var(--color-ember-orange)] transition-colors"
                      aria-label="Remove milestone"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  value={mInput}
                  onChange={e => setMInput(e.target.value)}
                  placeholder="Add milestone"
                  className="flex-1"
                />
                <button
                  className="btn-ghost"
                  onClick={() => { if (mInput.trim()) { setMilestones([...milestones, mInput.trim()]); setMInput(""); } }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--color-mist)]">
              <button onClick={create} className="btn-primary flex-1">Create job</button>
              <Link href="/app"><button className="btn-ghost flex-1">Cancel</button></Link>
            </div>
            <p className="text-[13px] text-[var(--color-slate)]">
              Data model: Job → Milestones → EscrowTransaction (logged). See PRODUCT.md data model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}