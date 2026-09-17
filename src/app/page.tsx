import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { GradientOrbs } from "@/components/marketing/GradientOrbs";
import { Button } from "@/components/ui/Button";
import { BentoCard } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      <GradientOrbs />

      {/* HERO — Editorial weight, no pill, violet underline */}
      <section className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 text-center relative">
        <div className="mx-auto max-w-[640px] fluid-enter">
          <h1 className="font-display text-[48px] sm:text-[60px] font-semibold leading-[0.9] tracking-[-1.6px] text-[#111827]">
            Pay for work,<br/><span className="text-[#862fe7] relative">not promises.<span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#ebdafd] rounded-full" /></span>
          </h1>
          <p className="mt-5 text-[17px] leading-[1.7] text-[#6b7589] max-w-[520px] mx-auto">
            Escrow for Bolivia → Nigeria. Fund once in BOB, release in USDC when work is approved. No custodial risk, no waiting.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/onboarding"><Button size="lg" magnetic>Start an escrow →</Button></Link>
          </div>
          <p className="mt-4 text-xs text-[#6b7589]">Non-custodial • Sponsored fees • Milestone-protected</p>
        </div>

        {/* Single proof card — Double-Bezel, wider span */}
        <div className="mt-16 mx-auto max-w-[560px] fluid-enter-fast">
          <BentoCard className="text-left" span="span 8 / span 8">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#862fe7]">Live escrow</p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d6fcf4] text-[#065f46] border border-[#a7f3d0]">Funded</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="font-display text-[28px] font-semibold">BOB 1,200</p>
              <p className="text-sm text-[#6b7589]">≈ USDC 182.40</p>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden"><div className="h-full w-[66%] bg-[#862fe7]" /></div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#6b7589]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 2 of 3 milestones approved
              <span className="ml-auto font-mono text-[11px] bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#d8e0ea]">Pollar • Stellar</span>
            </div>
            <div className="absolute inset-0 -z-10 orb-violet opacity-30" />
          </BentoCard>
          <p className="text-center text-xs text-[#6b7589] mt-3">Real Pollar payment • <code className="bg-[#f1f5f9] px-1 py-0.5 rounded">runTx('payment')</code> • Hash in Monitor → Transactions</p>
        </div>
      </section>

      {/* PROBLEM — Editorial split, no cards */}
      <section id="problem" className="relative bg-[#f1f5f9] border-y border-[#d8e0ea] overflow-hidden">
        <div className="absolute -right-24 top-0 w-[520px] h-[520px] orb-violet opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-[1200px] px-6 py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start relative">
          <div className="fluid-enter">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#862fe7]">The problem</p>
            <h2 className="font-display text-[32px] sm:text-[36px] font-semibold leading-[0.95] tracking-[-0.8px] text-[#111827] mt-3">
              A designer in La Paz <span className="text-[#862fe7]">pays</span>.<br/>A developer in Lagos <span className="text-[#862fe7]">waits</span>.
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#3f4654] max-w-[520px]">
              <p>Remittance fees take <span className="font-semibold text-[#111827]">12%</span> — a week's work. Settlement drags <span className="font-semibold text-[#111827]">6 days</span> across banks, with no way to hold funds safely for milestones.</p>
              <p>Clients in Bolivia have Pollar's live BOB on-ramp. Freelancers in Nigeria have the skill. The corridor between them is <span className="underline decoration-[#ad6df4] decoration-2 underline-offset-4">empty</span> — no escrow, no protection, no instant USDC.</p>
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8e0ea]">High fees</span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8e0ea]">Multi-day delay</span>
              <span className="px-3 py-1.5 rounded-full bg-[#111827] text-white">No escrow</span>
            </div>
          </div>
          {/* Right: minimal stats — not cards, just rule + numbers */}
          <div className="relative pl-8 lg:pl-10 border-l-2 border-[#d8e0ea] lg:border-l-0 lg:before:content-[''] lg:before:absolute lg:before:left-0 lg:before:top-2 lg:before:bottom-2 lg:before:w-[1.5px] lg:before:bg-[#862fe7]/15 fluid-enter-fast">
            <div className="space-y-8">
              <div>
                <p className="font-display text-[44px] font-semibold leading-none tracking-[-1.2px] text-[#111827]">12<span className="text-[#862fe7]">%</span></p>
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7589] mt-1">Average remittance fee lost</p>
                <p className="text-sm text-[#3f4654] mt-2">Source: World Bank corridor data — freelance payouts under $500 lose disproportionately.</p>
              </div>
              <div className="h-px bg-[#d8e0ea]" />
              <div>
                <p className="font-display text-[44px] font-semibold leading-none tracking-[-1.2px] text-[#111827]">6<span className="text-[#862fe7]"> days</span></p>
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7589] mt-1">Typical settlement</p>
                <p className="text-sm text-[#3f4654] mt-2">Bank wires → FX desk → local payout. No weekend movement.</p>
              </div>
              <div className="h-px bg-[#d8e0ea]" />
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-[#862fe7] shrink-0" />
                <p className="text-sm text-[#111827] leading-relaxed"><span className="font-semibold">BridgePay adds the missing half:</span> escrow held on Stellar, release is <code className="bg-[#f1f5f9] px-1 rounded">runTx('payment')</code> — instant, sponsored, auditable. Not a demo ramp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 steps, Bento grid */}
      <section id="how-it-works" className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[#f1f5f9]">
        <div className="max-w-[640px] fluid-enter">
          <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#862fe7]">How it works</p>
          <h2 className="font-display text-[30px] font-semibold tracking-[-0.8px] mt-2">Fund. Hold. Release.</h2>
          <p className="text-[15px] leading-relaxed text-[#6b7589] mt-3">No raw hashes, no jargon. Just three states you can see.</p>
        </div>
        <div className="bento-grid mt-10 fluid-enter-stagger">
          {[
            { n:"01", h:"Fund", d:"BOB via Pollar's live on-ramp. Settled to Stellar escrow, confirmed in ~2s.", span:"span 4 / span 4" },
            { n:"02", h:"Hold", d:"Funds sit in a non-custodial escrow. Release checks status — idempotent.", span:"span 4 / span 4" },
            { n:"03", h:"Release", d:"All milestones approved → USDC to freelancer's Pollar wallet. Instant.", span:"span 4 / span 4" },
          ].map(s=> (
            <BentoCard key={s.n} span={s.span} className="p-6">
              <p className="text-xs font-bold tracking-[0.1em] text-[#ad6df4]">{s.n}</p>
              <h3 className="font-display text-[18px] font-semibold mt-2">{s.h}</h3>
              <p className="text-sm text-[#6b7589] mt-2 leading-relaxed">{s.d}</p>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* WHY — Bento grid, 3 minimal points */}
      <section id="why" className="bg-[#f1f5f9] border-y border-[#d8e0ea]">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[22px] font-semibold">Built for the hackathon track.</h2>
            <Link href="/activity" className="text-sm font-semibold text-[#862fe7] hover:underline">View audit log →</Link>
          </div>
          <div className="bento-grid mt-8 fluid-enter-stagger">
            {[
              { t:"Live ramp", d:"BOB on-ramp is production, not a slide.", span:"span 4 / span 4" },
              { t:"Non-custodial", d:"Pollar KMS holds keys — no seeds on our servers.", span:"span 4 / span 4" },
              { t:"Auditable", d:"Every transition timestamped with Stellar hash.", span:"span 4 / span 4" },
            ].map(x=> (
              <BentoCard key={x.t} span="span 4 / span 4" className="p-6">
                <h3 className="font-semibold text-sm">{x.t}</h3>
                <p className="text-sm text-[#6b7589] mt-1">{x.d}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* CORRIDOR — quiet, one CTA */}
      <section id="corridor" className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="rounded-[32px] bg-[#111827] text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 fluid-enter">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#ad6df4]">Bolivia → Nigeria</p>
            <h2 className="font-display text-[24px] font-semibold mt-2">The corridor that was missing.</h2>
            <p className="text-sm text-[#cbd5e1] mt-2 max-w-[520px]">LatAm BOB in, African USDC out. Pollar already runs the first half; BridgePay closes the loop for freelance work.</p>
          </div>
          <Link href="/onboarding"><Button size="md" magnetic>Try the escrow →</Button></Link>
        </div>
      </section>

      <footer className="border-t border-[#d8e0ea] py-6 text-center text-xs text-[#6b7589]">
        <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between">
          <span>© 2026 BridgePay • Pollar SDK • Stellar</span>
          <span className="flex gap-4"><Link href="/activity" className="hover:text-[#862fe7]">Audit</Link><a href="https://docs.pollar.xyz" target="_blank" className="hover:text-[#862fe7]">Docs</a></span>
        </div>
      </footer>
    </div>
  );
}