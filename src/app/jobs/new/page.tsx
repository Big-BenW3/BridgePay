"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getState, pushLog, upsertJob, type UserState, type JobState } from "@/lib/api";

export default function NewJobPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState>(null);
  useEffect(() => {
    getState().then((s) => setUser(s.user)).catch(() => setUser(null));
  }, []);
  const [title, setTitle] = useState("Landing page for NGO");
  const [desc, setDesc] = useState("3-page marketing site + CMS, responsive, handover docs.");
  const [amount, setAmount] = useState("1200");
  const [milestones, setMilestones] = useState<string[]>(["Wireframes & design", "Frontend build", "QA & deploy"]);
  const [mInput, setMInput] = useState("");

  const create = async () => {
    if (!user || user.role !== "client") { alert("Switch to Client role in /onboarding to create jobs (demo guard)"); return; }
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

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="mx-auto max-w-[720px] px-6 py-8">
        <Link href="/app" className="text-sm font-medium text-[#862fe7] hover:underline">← Dashboard</Link>
        <div className="fluid-enter">
          <h1 className="font-display text-[28px] font-semibold mt-3">Create escrow job</h1>
          <p className="text-sm text-[#6b7589]">Fund in BOB via Pollar's live ramp → held in Stellar escrow. Milestones protect both sides.</p>
        </div>

        <div className="fluid-enter-stagger">
          <Card className="mt-6 space-y-5 hover">
            <div className="core p-6 space-y-5">
              <div>
                <label className="text-xs font-bold tracking-wide uppercase text-[#3f4654]">Job title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full border border-[#d8e0ea] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ad6df4]" placeholder="e.g. Brand site build" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wide uppercase text-[#3f4654]">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="mt-1 w-full border border-[#d8e0ea] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ad6df4]" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wide uppercase text-[#3f4654]">Amount (BOB)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="mt-1 w-full border border-[#d8e0ea] rounded-[12px] px-4 py-3 text-sm" />
                <p className="text-xs text-[#6b7589] mt-1">Settles as USDC to freelancer on release. Conversion simulated at ~0.152 USDC/BOB for demo.</p>
              </div>

              <div>
                <label className="text-xs font-bold tracking-wide uppercase text-[#3f4654]">Milestones</label>
                <div className="mt-1 space-y-2">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 double-bezel hover" style={{ gridColumn: "span 1" }}>
                      <div className="core p-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#ebdafd] text-[#5f259e] grid place-items-center text-xs font-bold">{i + 1}</span>
                        <span className="flex-1">{m}</span>
                        <button onClick={() => setMilestones(milestones.filter((_, x) => x !== i))} className="text-[#6b7589] hover:text-red-600">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={mInput} onChange={e => setMInput(e.target.value)} placeholder="Add milestone" className="flex-1 border border-[#d8e0ea] rounded-[12px] px-3 py-2 text-sm" />
                  <Button size="sm" variant="ghost" onClick={() => { if (mInput.trim()) { setMilestones([...milestones, mInput.trim()]); setMInput(""); } }}>Add</Button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={create} className="flex-1" magnetic>Create job →</Button>
                <Link href="/app"><Button variant="ghost" className="flex-1">Cancel</Button></Link>
              </div>
              <p className="text-xs text-[#6b7589]">Data model: Job → Milestones → EscrowTransaction (logged). See PRODUCT.md data model.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}