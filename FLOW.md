# BridgePay — Flow & Test Guide

> Bolivia (BOB) → Nigeria (USDC) freelance escrow on **Pollar SDK + Stellar**. Built per `PRODUCT.md` FR1-FR6, design per `DESIGN.md` Supahub violet, motion per Emil Kowalski.

## What was built

**Stack:** Next.js 15 App Router · Tailwind v4 `@theme` tokens (`#862fe7`, `#ebdafd`, `12px`/`9999px` radii, Bricolage Grotesque + Geist via `next/font`) · Neon Postgres · Prisma (`prisma/schema.prisma`: `User`, `Job`, `Milestone`, `EscrowTransaction`, `AppLog`) · Pollar `@pollar/core@0.11.3` + `@pollar/react@0.11.3` · Stellar SDK · Vercel.

**Real Pollar wiring (not mock):**
- `src/app/layout.tsx` → `PollarGate` → `<PollarProvider client={getPollarClient()}>` (docs `quickstart §2`)
- `src/lib/pollar-client.ts` singleton `PollarClient` (client-only to avoid SSR warnings)
- `src/lib/pollar.ts` server helpers: `getKycStatus`, `startKyc`, `createOnRamp`, `sendPayment`, `getBalance` via `PollarClient` (docs `sdk-reference/pollar-core`)
- `src/app/api/pollar/route.ts` — server SDK endpoint for status (`GET`) and release (`POST sendPayment`)
- `src/app/onboarding/page.tsx` — `usePollar()` auth: `openLoginModal()`, `WalletButton`, `openKycModal({country:"BO"|"NG", level:"basic"})` (docs `pollar-react §KYC`)
- `src/app/wallet/page.tsx` — `wallet`, `walletBalance`/`refreshWalletBalance`, `openRampModal`, `txHistory`/`openTxHistoryModal` (docs `quickstart §5`)
- `src/app/jobs/[id]/page.tsx` — fund = `openRampModal()` (BOB→USDC onRamp), release = `runTx('payment', {destination, amount, asset:{code:"USDC",issuer}})` (docs `quickstart §4`) — sponsored fee, hash persisted
- Escrow model: logical `Job.escrowWalletId` + `EscrowTransaction(pollarTxId)`; escrow auto-created per `src/lib/pollar.ts:pollarGetOrCreateEscrow()` — throws if `ESCROW_WALLET_ID` not set (honest)
- **DB persistence:** `/api/state` (GET), `/api/user` (POST), `/api/jobs` (POST), `/api/logs` (POST) via Prisma → Neon

**Polish (Emil):**
- `--ease-out: cubic-bezier(0.32,0.72,0,1)` / `--ease-drawer`, `transition: transform 160ms var(--ease-out)` (never `all`), `active:scale(0.97)`, transform/opacity GPU-only, `hover` gated `@media (hover:hover)`, stagger `40ms` on hero cards, `card-interactive:hover translateY(-2px)`, `prefers-reduced-motion` guard, `@starting-style` via `emil-in` keyframes (`scale(0.98)` not `0`).

## How it's supposed to work

```
Onboarding (FR1) ──► Job create (FR2.1) ──► Fund (FR2.2 BOB→escrow via Ramp) ──► Milestones (FR4) ──► Release (FR5 USDC) ──► Wallet/CashOut (FR6)
   │ login() → wallet │ Pollar creates G… + KMS + trustlines            │ polling │ submitted→approved │ runTx('payment') idempotent │ P2P/Yellow Card roadmap
   └ KYC openKycModal → approved gates funding ──────────────────────────┘         └ activity log
```

State machine (PRODUCT.md §6): `open → funded → in_progress → approved → released → closed`. Every transition timestamped + Pollar req/res logged (`src/lib/logger.ts` + `activity` page) for judging.

**Routes:**
- `/` landing (hero + Supahub bands)
- `/onboarding` role select + real Pollar wallet + KYC
- `/app` dashboard (jobs, filter `all/open/funded/...`) + **Seed demo job** button
- `/jobs/new` + `/jobs/[id]` milestones + fund/release
- `/wallet` Pollar `walletBalance` + local escrow balances + **txHistory** + cash-out info (honest non-live)
- `/activity` audit log (Pollar tx hashes + DB state)
- `/api/health` → `{ok, network:"testnet", hasPollarKey, escrow:"pending"}`
- `/api/state` → full state rehydration
- `/api/pollar?action=release` → server-signed release

## What you should get / values to test

**Keys (testnet):** In `.env` you already have:
```
POLLAR_API_KEY=pub_testnet_083007b962cb03424176a242a6efa945
POLLAR_SECRET=sec_testnet_d7df48670ab741c53cdd60f26d39c88485c7ed39aca351e8ac54625718aac052
NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY=pub_testnet_083007b962cb03424176a242a6efa945
POLLAR_NETWORK=testnet / NEXT_PUBLIC_POLLAR_NETWORK=testnet
DATABASE_URL=neondb_owner:npg_XS2DB5hbrwWi@ep-dark-fog-al5ffq3b-pooler.../naijagig  (Neon eu-central-1)
```
Never expose `sec_testnet_...` client-side; keep `pub_testnet_...` as `NEXT_PUBLIC_` (docs `api-keys`).

**Demo values (use these exactly for judging video):**
- Job: Title `Landing page for NGO`, Desc `3-page marketing + CMS`, **Amount BOB 1200** → converts ~ **USDC 182.40** (`0.152` demo rate, real ramp quote from `getRampsQuote`)
- Milestones: `Wireframes & design` → `Frontend build` → `QA & deploy`
- Freelancer G… address: use the **Pollar wallet address shown in `/onboarding` after `login()`** (e.g. `GD...` or `GB...`). For local-only mock, `G` + 55 chars works but Friendbot will reject invalid checksum — use Pollar's real wallet for real `runTx`.

**Expected hashes:**
- Fund (Ramp): `openRampModal` → anchor KYC if needed → Stellar hash `2-3s` → appears in Pollar Dashboard **Monitor → Transactions** + `/activity` as `pollar_onramp`
- Release: `runTx('payment')` → hash like `8f3a...64hex` → `txHistory` + `/activity` `pollar_release` + Stellar Expert `https://stellar.expert/explorer/testnet/tx/{hash}`
- Sponsored fees: app's funding wallet (Dashboard **Treasury → Account Funding**) pays XLM — user pays `0`

## Testnet setup to test

1. **Dashboard:** `dashboard.pollar.xyz` → app **BridgePay** → Build → API Keys (already `pub_testnet_...`) → Treasury → Tokens & Trustlines: enable **USDC** (code `USDC`, issuer `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` is Stellar testnet USDC; if your app uses different issuer, copy from Treasury), enable **trustline sponsoring** + **Fund funding mode = Immediate** (so Pollar auto-creates/funds G wallets on login). Sponsorship on.
2. **Env:** `cp .env.example .env` → fill `DATABASE_URL`, `NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY`, `POLLAR_SECRET_KEY=sec_testnet_...`, `NEXT_PUBLIC_POLLAR_NETWORK=testnet`, `NEXT_PUBLIC_APP_URL=http://localhost:3000`.
3. **DB:** `npm run db:generate` (already done `v6.19.3`) → `npm run db:push` to push `prisma/schema.prisma` to Neon (first time).
4. **Faucets:**
   - Stellar testnet XLM: Pollar auto-funds custodial wallets; for external Freighter: `laboratory.stellar.org/#account-creator?network=test` → Friendbot `10000 XLM`.
   - Pollar USDC testnet: dashboard faucet or `openRampModal` → onRamp **BO BOB** (use test anchor flow; if anchor needs KYC, use `openKycModal` first). For pure `runTx` without ramp, wallet needs USDC balance — use Pollar Dashboard **Users → Wallets → Fund** or swap.
5. **Run:** `npm install` (already 401 pkgs) → `npm run dev` → `http://localhost:3000` → Test checklist `PRODUCT.md §11`:
   - [ ] Wallet created via `login()` → `wallet.address` `G…` appears in `/onboarding` + `/wallet`
   - [ ] KYC `openKycModal` → approved → funding unlocked
   - [ ] Job create → `open` → Fund via `RampWidget` (or Mock fund button for offline demo) → `funded` + `txFund` logged
   - [ ] Freelancer role → milestones `submitted` → client `approved` → `approved`
   - [ ] Release → `runTx('payment')` → hash → freelancer `/wallet` `walletBalance` increments, `/activity` log + Dashboard Monitor
   - [ ] `GET /api/health` → `{ok:true, hasPollarKey:true, escrow:"pending"}`
   - [ ] Browser refresh → data persists (Neon/Prisma)

**Prod:** Push to Vercel, set same env in dashboard (secret not `NEXT_PUBLIC`), `prisma db push --accept-data-loss` on Neon `main`, record screen.