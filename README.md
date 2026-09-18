# BridgePay

**Pollar-powered escrow. BOB in. USDC out. Stellar speed.**

---

## The Problem

A designer in La Paz pays. A developer in Lagos waits.

- **12%** average remittance fee lost (World Bank corridor data)
- **6 days** typical bank settlement — no weekend movement
- **Zero** escrow protection for milestone-based freelance work

Bolivia has Pollar's live BOB on-ramp. Nigeria has the talent. The corridor between them was empty — until BridgePay.

---

## What BridgePay Does

| Step | Action | Tech |
|------|--------|------|
| **Fund** | Client pays BOB via Pollar's production on-ramp | Pollar SDK (`runTx('onramp')`) |
| **Hold** | Funds lock in non-custodial Stellar escrow | Pollar KMS (no seeds on our servers) |
| **Release** | All milestones approve → USDC to freelancer | `runTx('payment')` — instant, sponsored fees |

Every transition is auditable on-chain. The [audit log](/activity) is your submission proof.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Client    │────▶│   Pollar SDK     │────▶│  Stellar Testnet│
│  (BOB)      │     │  (KMS + Ramp)    │     │  (Escrow + USDC)│
└─────────────┘     └──────────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │   Neon Postgres  │
                    │  (Prisma ORM)    │
                    └──────────────────┘
```

- **Frontend**: Next.js 15 (App Router) + Tailwind v4
- **Escrow & Identity**: `@pollar/core` + `@pollar/react` v0.11.3
- **Database**: Neon serverless Postgres via Prisma
- **Design**: Ventriloc-inspired editorial system (Space Grotesk + Inter, warm grays, single ember accent)

---

## Features

- **Milestone-gated escrow** — funds release only when *all* milestones approve
- **Role-based permissions** — clients create/approve/release; freelancers submit
- **Real Pollar integration** — KYC, ramp, balances, tx history, `sendPayment`
- **Non-custodial** — Pollar KMS holds keys; we never see seeds
- **Full audit trail** — every state transition logged with Stellar tx hash
- **Sponsored fees** — users pay zero Stellar fees
- **Persistence survives reload** — Neon + Prisma, no localStorage

---

## Quick Start

### Prerequisites

- Node 20+
- Pollar testnet app (Dashboard → create app → copy keys)
- Neon database (free tier works)

### Environment Variables

```bash
cp .env.example .env
```

Required:
```env
DATABASE_URL="postgresql://..."
POLLAR_API_KEY="pub_testnet_..."
POLLAR_SECRET="sec_testnet_..."
POLLAR_NETWORK="testnet"
NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY="pub_testnet_..."
NEXT_PUBLIC_POLLAR_NETWORK="testnet"
ESCROW_WALLET_ID="G..."          # Real Stellar testnet address (from Pollar Dashboard)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Install & Run

```bash
npm install
npm run db:generate
npm run db:push
npm run escrow:create   # Validates ESCROW_WALLET_ID + shows on-chain balances
npm run dev
```

Open `http://localhost:3000`.

---

## Demo Flow (for judges)

1. **Landing** → `/` — pitch + live escrow proof card
2. **Onboarding** → `/onboarding` — pick role (Client/Freelancer), connect Pollar wallet, KYC
3. **Dashboard** → `/app` — stats, job list, filters
4. **Create Job** → `/jobs/new` (Client only) — title, BOB amount, milestones
5. **Job Detail** → `/jobs/:id`
   - Client: Fund (Ramp or Mock) → Approve milestones → Release (real `sendPayment`)
   - Freelancer: Submit milestones
6. **Wallet** → `/wallet` — balances, ramp, tx history
7. **Audit Log** → `/activity` — complete JSON export for submission

**Persistence test**: Refresh browser at any step — jobs, transactions, logs all survive.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/       # Health + escrow status
│   │   ├── jobs/         # CRUD + transactions
│   │   ├── pollar/       # Server SDK (status, sendPayment)
│   │   ├── user/         # Upsert user/role
│   │   ├── state/        # Full state for polling
│   │   ├── logs/         # Append-only audit
│   │   └── reset/        # Demo wipe
│   ├── onboarding/       # Role pick + wallet connect
│   ├── app/              # Dashboard
│   ├── jobs/
│   │   ├── new/          # Create job (client only)
│   │   └── [id]/         # Job detail + milestones + release
│   ├── wallet/           # Balances, ramp, history
│   └── activity/         # Audit log + submission tools
├── components/
│   ├── marketing/        # Navbar
│   └── ui/               # Button, Card, Badge (Ventriloc style)
├── lib/
│   ├── api.ts            # Client fetch helpers
│   ├── db.ts             # Prisma singleton
│   ├── pollar.ts         # Server Pollar helpers
│   ├── pollar-client.ts  # Browser PollarClient singleton
│   └── logger.ts         # Structured logging
└── scripts/
    └── create-escrow.ts  # Validate escrow + show balances
```

---

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build (lint + typecheck)
npm run lint         # ESLint
npm run db:generate  # Prisma generate
npm run db:push      # Push schema to Neon
npm run escrow:create # Verify ESCROW_WALLET_ID on-chain
```

---

## Design System

Based on **Ventriloc** — editorial data observatory on warm paper.

- **Fonts**: Space Grotesk (PolySans substitute) for headings, Inter for body
- **Palette**: Graphite `#202020`, Canvas White, Ash `#efefef`, Ember Orange `#ff682c` (accent only), Brass `#816729`
- **Radius**: 0px buttons, 8px cards, 6px 0px 0px asymmetric featured cards, 200px nav pills
- **No shadows** — depth via surface contrast (White ↔ Ash bands)
- **80px section gaps**, 20px element gaps

---

## Hackathon Submission Checklist

- [ ] Real Pollar SDK integration (not mocked)
- [ ] Non-custodial escrow with Stellar settlement
- [ ] Milestone-gated release logic
- [ ] Full audit log with Stellar tx hashes
- [ ] Persistent Neon database
- [ ] Role-based permissions enforced server-side
- [ ] Clean production build (`npm run build` ✅)
- [ ] Demo survives page refresh

---

## License

MIT — built for the Pollar hackathon.