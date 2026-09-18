import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO — Editorial poster, two-column split */}
      <section className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
{/* Left: Headline + subtext + dual CTA */}
           <div>
            <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
              Escrow for cross-border work
            </p>
            <h1 className="font-polysans text-[66px] leading-[0.91] tracking-[-1.32px] text-[var(--color-graphite)] font-medium">
              BOB in.<br/>USDC out.<br/><span className="relative">Escrow that moves<span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[var(--color-ember-orange)]" /></span> at Stellar speed.
            </h1>
            <p className="mt-6 text-[18px] leading-[1.25] text-[var(--color-steel)] font-[var(--font-inter)] max-w-[480px]">
              Fund once in BOB via Pollar's live on-ramp. Hold in non-custodial Stellar escrow. Release in USDC the moment milestones approve. No custodial risk, no week-long settlement.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/onboarding">
                <button className="btn-primary">Start an escrow</button>
              </Link>
              <Link href="/activity">
                <button className="btn-ghost">View audit log</button>
              </Link>
            </div>
            <p className="mt-6 text-[13px] text-[var(--color-slate)] font-[var(--font-inter)]">
              Non-custodial • Sponsored fees • Milestone-protected
            </p>
          </div>

{/* Right: Three overlapping data dashboard cards */}
           <div className="relative lg:pl-12" style={{ zIndex: 1 }}>
            <div className="relative h-[420px] w-full">
              {/* Card 1: Finance chart */}
              <div className="data-card absolute top-0 left-0 w-[70%] h-[65%] z-10" style={{ boxShadow: '0 20px 40px rgba(32,32,32,0.08)' }}>
                <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mb-4">Escrow volume</p>
                <div className="h-[220px] relative">
                  <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="emberGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff682c" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#ff682c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M20,180 C80,140 140,60 200,40 C260,20 320,60 380,50" stroke="#ff682c" strokeWidth="2" fill="url(#emberGrad)" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20,190 C80,150 140,100 200,80 C260,60 320,90 380,85" stroke="#816729" strokeWidth="1.5" fill="none" strokeDasharray="6,4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-4 text-[14px] text-[var(--color-slate)]">24h rolling • Pollar on-ramp</p>
              </div>

              {/* Card 2: Revenue stat */}
              <div className="data-card absolute top-[10%] right-0 w-[55%] h-[45%] z-20" style={{ boxShadow: '0 20px 40px rgba(32,32,32,0.08)' }}>
                <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mb-2">Active escrows</p>
                <p className="font-polysans text-[44px] font-medium text-[var(--color-graphite)] leading-[0.91] tracking-[-0.88px]">147</p>
                <p className="mt-2 text-[13px] text-[var(--color-slate)]">+12% vs last week</p>
              </div>

              {/* Card 3: Profitability ring */}
              <div className="data-card absolute bottom-0 left-[15%] w-[60%] h-[45%] z-30" style={{ boxShadow: '0 20px 40px rgba(32,32,32,0.08)' }}>
                <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mb-4">Release rate</p>
                <div className="flex items-center justify-center gap-8">
                  <svg viewBox="0 0 120 120" className="w-24 h-24">
                    <circle cx="60" cy="60" r="50" stroke="#e8e8e8" strokeWidth="8" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="#ff682c" strokeWidth="8" fill="none" strokeDasharray="314" strokeDashoffset="47" strokeLinecap="round" transform="rotate(-90 60 60)" />
                    <text x="60" y="68" textAnchor="middle" fontFamily="Space Grotesk" fontSize="28" fontWeight="400" fill="#202020">85%</text>
                  </svg>
                  <div>
                    <p className="text-[13px] text-[var(--color-slate)]">Milestones released</p>
                    <p className="font-polysans text-[18px] font-medium text-[var(--color-graphite)]">On-time delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER LOGO STRIP — White canvas, monochrome logos */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 border-t border-[var(--color-mist)] border-b border-[var(--color-mist)]">
        <p className="font-polysans text-[13px] font-medium text-[var(--color-brass)] tracking-[0.1em] uppercase mb-8 text-center">
          Trusted by 80+ partners
        </p>
        <div className="flex items-center justify-center gap-[60px] opacity-60">
          {["Pollar", "Stellar", "Neon", "Vercel", "Inter", "Tailwind", "Prisma"].map((name) => (
            <span key={name} className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] select-none">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* THE PROBLEM — Alternating Ash surface band */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 bg-[var(--surface-ash-surface)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
<div>
             <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
              The problem
            </p>
            <h2 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
              A designer in La Paz <span className="text-[var(--color-ember-orange)]">pays</span>.<br/>A developer in Lagos <span className="text-[var(--color-ember-orange)]">waits</span>.
            </h2>
            <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-[var(--color-steel)] max-w-[520px]">
              <p>Remittance fees take <span className="font-medium text-[var(--color-graphite)]">12%</span> — a week&apos;s work. Settlement drags <span className="font-medium text-[var(--color-graphite)]">6 days</span> across banks, with no way to hold funds safely for milestones.</p>
              <p>Clients in Bolivia have Pollar&apos;s live BOB on-ramp. Freelancers in Nigeria have the skill. The corridor between them is <span className="link-ember">empty</span> — no escrow, no protection, no instant USDC.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="tag tag-brass">High fees</span>
              <span className="tag tag-brass">Multi-day delay</span>
              <span className="tag tag-ember">No escrow</span>
            </div>
          </div>

          <div className="relative pl-10 lg:pl-12 border-l-2 border-[var(--color-mist)]">
            <div className="space-y-10">
              <div>
                <p className="font-polysans text-[44px] leading-[0.91] tracking-[-0.88px] text-[var(--color-graphite)] font-medium">12<span className="text-[var(--color-ember-orange)]">%</span></p>
                <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] mt-1">Average remittance fee lost</p>
                <p className="text-[14px] text-[var(--color-steel)] mt-2">Source: World Bank corridor data — freelance payouts under $500 lose disproportionately.</p>
              </div>
              <div className="pt-10 border-t border-[var(--color-mist)]">
                <p className="font-polysans text-[44px] leading-[0.91] tracking-[-0.88px] text-[var(--color-graphite)] font-medium">6<span className="text-[var(--color-ember-orange)]"> days</span></p>
                <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-slate)] mt-1">Typical settlement</p>
                <p className="text-[14px] text-[var(--color-steel)] mt-2">Bank wires → FX desk → local payout. No weekend movement.</p>
              </div>
              <div className="pt-10 border-t border-[var(--color-mist)] flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-[var(--color-ember-orange)] shrink-0" />
                <p className="text-[14px] text-[var(--color-graphite)] leading-relaxed">
                  <span className="font-medium">BridgePay adds the missing half:</span> escrow held on Stellar, release is <code className="px-1 rounded bg-[var(--color-fog)]">runTx(&apos;payment&apos;)</code> — instant, sponsored, auditable. Not a demo ramp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — White canvas */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="max-w-[640px]">
          <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-4">
            How it works
          </p>
          <h2 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium mt-2">
            Fund. Hold. Release.
          </h2>
          <p className="mt-4 text-[18px] leading-[1.25] text-[var(--color-steel)]">
            No raw hashes, no jargon. Just three states you can see.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-[var(--element-gap)] mt-10">
          {[
            { n: "01", h: "Fund", d: "BOB via Pollar&apos;s live on-ramp. Settled to Stellar escrow, confirmed in ~2s." },
            { n: "02", h: "Hold", d: "Funds sit in a non-custodial escrow. Release checks status — idempotent." },
            { n: "03", h: "Release", d: "All milestones approved → USDC to freelancer&apos;s Pollar wallet. Instant." },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <p className="font-polysans text-[13px] font-medium text-[var(--color-brass)] tracking-[0.1em] uppercase">{s.n}</p>
              <h3 className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mt-2">{s.h}</h3>
              <p className="text-[14px] text-[var(--color-steel)] mt-3 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY — Ash band */}
      <section className="bg-[var(--surface-ash-surface)] py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-polysans text-[22px] font-medium text-[var(--color-graphite)]">Built for the hackathon track.</h2>
            <Link href="/activity" className="link-ember font-polysans text-[15px]">View audit log</Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-[var(--element-gap)] mt-8">
            {[
              { t: "Live ramp", d: "BOB on-ramp is production, not a slide." },
              { t: "Non-custodial", d: "Pollar KMS holds keys — no seeds on our servers." },
              { t: "Auditable", d: "Every transition timestamped with Stellar hash." },
            ].map((x) => (
              <div key={x.t} className="card p-6">
                <h3 className="font-polysans text-[18px] font-medium text-[var(--color-graphite)]">{x.t}</h3>
                <p className="text-[14px] text-[var(--color-steel)] mt-2">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORRIDOR — Ivory accent wash */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 bg-[var(--surface-ivory-surface)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="font-polysans text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-ember-orange)] mb-2">
              Bolivia → Nigeria
            </p>
            <h2 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
              The corridor that was missing.
            </h2>
            <p className="mt-3 text-[15px] text-[var(--color-steel)] max-w-[520px]">
              LatAm BOB in, African USDC out. Pollar already runs the first half; BridgePay closes the loop for freelance work.
            </p>
          </div>
          <Link href="/onboarding"><button className="btn-primary whitespace-nowrap">Try the escrow</button></Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-mist)] py-10 text-center text-[13px] text-[var(--color-slate)]">
        <div className="mx-auto max-w-[1200px] px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 BridgePay • Pollar SDK • Stellar</span>
          <div className="flex gap-6">
            <Link href="/activity" className="link-ember font-polysans">Audit</Link>
            <a href="https://docs.pollar.xyz" target="_blank" rel="noopener noreferrer" className="link-ember font-polysans">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}