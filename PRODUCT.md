# BridgePay — Product Requirements Document

**Built on Pollar SDK | Boundless x Pollar Hackathon | Sep 2026**

---

## 1. Overview

**BridgePay** is a cross-border freelance escrow platform connecting clients in Bolivia (Latin America) with freelancers in Nigeria (Africa), settled entirely through the Pollar SDK.

Pollar already runs a live BOB (Bolivian Boliviano) on-ramp on the LatAm side. BridgePay builds the missing corridor half: a real, well-designed African-side flow — funding, holding, and releasing payment — for a concrete use case (freelance work), rather than an abstract demo ramp.

### 1.1 Problem Statement
Freelancers in Nigeria lose significant value and time when getting paid by international clients: high remittance fees, multi-day settlement, currency risk, and lack of trust/escrow protection for milestone-based work. Clients in LatAm lack a simple, non-custodial way to pay African freelancers with payment protection.

### 1.2 Solution
A milestone-based escrow app where:
- Clients fund jobs in BOB through Pollar's live ramp
- Funds sit in a non-custodial Stellar escrow wallet (optionally earning yield via Blend/DeFindex while work is in progress)
- On milestone approval, funds release instantly to the freelancer's own non-custodial Pollar wallet as USDC
- From there, the freelancer controls the funds and exits to local currency via any off-ramp channel they choose (P2P, local agent, exchange) — explicitly out of scope for this MVP, documented as a roadmap item

### 1.3 Target Track
"Best Pollar Integration" — Stellar-based, judged on working end-to-end payment flow, SDK integration quality, proof of real usage, and project clarity.

---

## 2. Users & Roles

| Role | Description | Primary Goal |
|---|---|---|
| **Client** | LatAm-based individual/business hiring a freelancer | Fund work safely, only pay on delivery |
| **Freelancer** | Nigeria-based worker delivering the job | Get paid reliably, in their own wallet, fast |
| **(System) Escrow Agent** | The smart contract / backend logic — not a human | Hold funds neutrally, release on approval |

For the MVP demo: build both roles fully in one app; seed a test client wallet so a single demoer can play both sides.

---

## 3. Functional Requirements

### FR1 — Onboarding & Identity
- FR1.1: User selects role (Client / Freelancer) on first launch
- FR1.2: System creates a Pollar wallet for the user via SDK (`@pollar/core`)
- FR1.3: System triggers KYC flow via Pollar SDK; blocks funding/payout actions until KYC status = approved
- FR1.4: Wallet address and KYC status are persisted against the user record

### FR2 — Job Creation & Escrow Funding
- FR2.1: Client creates a job (title, description, amount in BOB, milestone list)
- FR2.2: Client funds the job by converting BOB → escrow wallet via Pollar's live on-ramp
- FR2.3: System confirms funds landed in the Stellar escrow wallet (poll or webhook confirmation from SDK)
- FR2.4: Job status transitions: `open → funded`

### FR3 — Yield While Held (optional, stretch)
- FR3.1: While job status = `funded` or `in_progress`, escrowed funds may be deposited into a Blend or DeFindex vault via SDK
- FR3.2: On release trigger, funds are withdrawn from the vault (principal + accrued yield) before transfer
- FR3.3: If yield fails or times out, system falls back to holding funds in the plain escrow wallet (never blocks release)

### FR4 — Milestone Management
- FR4.1: Freelancer marks a milestone as `submitted`
- FR4.2: Client reviews and marks milestone as `approved` or requests changes
- FR4.3: On final milestone approval, job status transitions to `approved`

### FR5 — Release to Freelancer
- FR5.1: On `approved`, backend triggers an SDK transfer from escrow wallet → freelancer's Pollar wallet (USDC)
- FR5.2: Job status transitions to `released → closed`
- FR5.3: Freelancer sees updated wallet balance in-app, confirmed via SDK wallet query

### FR6 — Freelancer Exit Path (documented, out of live scope)
- FR6.1: App displays freelancer's USDC balance and wallet address clearly
- FR6.2: App shows an informational "Cash Out" screen documenting available off-ramp options (P2P exchange, local agent network, licensed off-ramp API) — no live integration required for MVP
- FR6.3: Roadmap note in-app and in README: production version integrates a licensed API (e.g. Yellow Card) settling via NIBSS to Nigerian bank accounts

### FR7 — Agent Payments (stretch, x402)
- FR7.1: Optional: a "verification agent" (could be simulated) is paid a micro-fee via x402 for confirming milestone delivery, demonstrating agent-payments capability

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Reliability** | Every SDK call (fund, hold, release) must be logged with request/response for demo proof and debugging |
| **Security** | No private keys or seed phrases stored on your backend — wallets remain non-custodial via SDK; use env vars / secrets manager for any API keys, never hardcoded |
| **Idempotency** | Release and funding actions must be safe to retry without double-spending (check job status before re-triggering SDK calls) |
| **Auditability** | Every state transition (funded, approved, released) is timestamped and stored for the judging demo/walkthrough |
| **Performance** | On-ramp and release actions should give the user feedback within 2–3s even if the underlying settlement takes longer (use optimistic UI + polling/webhook confirmation) |
| **Usability** | Status of funds must always be visible in plain language ("Funds locked in escrow," "Released to your wallet") — no raw transaction hashes as the primary UI |
| **Scalability (design-level, not required to build)** | Data model supports multiple concurrent jobs per user, multiple milestones per job, and pluggable off-ramp providers without schema change |
| **Testability** | Escrow and release logic must be testable against Stellar testnet before any live/mainnet demo |
| **Honesty of scope** | Anything simulated/mocked (e.g. cash-out gateway) must be clearly labeled as such in-app and in docs — never presented as live when it isn't |

---

## 5. System Architecture

```
┌──────────────┐      ┌───────────────────┐      ┌────────────────────┐
│   Frontend    │─────▶│    Pollar SDK      │─────▶│   Pollar Backend    │
│ (Next.js/RN)  │      │ @pollar/core +     │      │ (wallets, KYC,      │
│               │      │ @pollar/react      │      │  BOB ramp, x402)    │
└──────────────┘      └───────────────────┘      └────────────────────┘
        │                                                    │
        │                                                    ▼
        │                                         ┌────────────────────┐
        │                                         │ Escrow Smart        │
        │                                         │ Contract (Stellar)  │
        │                                         └────────────────────┘
        ▼
┌──────────────┐      ┌───────────────────┐
│  Your Backend │─────▶│ Job / Milestone    │
│  (Node/Express│      │ state machine       │
│   or similar) │      │ (your DB)           │
└──────────────┘      └───────────────────┘
```

---

## 6. Data Model

```
User
 - id, role (client | freelancer), country
 - pollarWalletId, kycStatus (pending | approved | rejected)

Job
 - id, clientId, freelancerId
 - title, description, amountBOB
 - status: open | funded | in_progress | approved | released | closed
 - yieldEnabled (bool)

Milestone
 - id, jobId, description
 - status: pending | submitted | approved

EscrowTransaction
 - id, jobId, pollarTxId, amount, currency, type (fund | yield_deposit | yield_withdraw | release)
 - timestamp

CashoutInfo (informational only — not a live gateway)
 - freelancerId, walletAddress, availableChannels[] (display-only content)
```

---

## 7. MVP Scope

### In Scope (build and demo live)
- Wallet creation + KYC for both roles
- Job creation with single or multi-milestone support
- BOB escrow funding via Pollar's live ramp
- Milestone approval logic
- Fund release to freelancer's Pollar wallet
- Clear status UI throughout
- Full logging of SDK calls for submission proof

### Stretch (build if time allows, in this order)
1. Yield integration (Blend/DeFindex) on held escrow funds
2. x402 agent-payment for milestone verification
3. Live off-ramp API integration for Nigeria cash-out (e.g. Yellow Card)

### Explicitly Out of Scope
- Building a licensed payment gateway / money transmitter for Nigeria
- Real NIBSS integration
- Multi-currency support beyond BOB/USDC
- Dispute resolution / arbitration system (note as roadmap item only)

---

## 8. Screens

1. Role selection + onboarding (KYC)
2. Job creation (client) / Job browse (freelancer)
3. Escrow funding screen (shows locked amount, yield indicator if enabled)
4. Milestone tracker (submit / approve)
5. Release confirmation screen
6. Freelancer wallet + "Cash Out" info screen (documented, non-live)
7. Transaction/activity log (for judge walkthrough — shows real SDK call history)

---

## 9. Scalability & Production Path (design notes, not build requirements)

- **Off-ramp abstraction**: `CashoutInfo.availableChannels` is designed as a pluggable list so a real off-ramp provider (Yellow Card, or others) can be added later without changing the core escrow logic.
- **Multi-corridor ready**: Job model isn't hardcoded to Nigeria/Bolivia — `country` fields on User make it straightforward to extend to other African/LatAm pairs Pollar supports.
- **Dispute handling**: Not built for MVP, but the state machine (`submitted → approved`) leaves room for a future `disputed` state without breaking existing transitions.
- **Agent network**: FR7's x402 stretch goal is a proof-of-concept for a broader idea — Pollar's x402 rail could eventually pay real human verification agents or off-ramp liquidity agents automatically.

---

## 10. Resources

| Resource | Link | Use |
|---|---|---|
| Pollar SDK Docs | docs.pollar.xyz | Setup, wallets, ramps, KYC, Earn (yield), x402 |
| Core SDK package | npmjs.com/package/@pollar/core | Main SDK install |
| React SDK package | npmjs.com/package/@pollar/react | React hooks/components |
| Telegram support | t.me/+eRBh0t5gAeZIMzhh | Pollar team live all week for SDK help, ramp access, design reviews, testing the Bolivian side |
| Pollar on X | x.com/pollar_xyz | Announcements |
| Hackathon page | boundlessfi.xyz/hackathons/pollar-hackathon-build-on-pollar | Rules, timeline, submission |

---

## 11. Testing Checklist (do before demo)

- [ ] Wallet created for both test users via SDK — confirm real wallet IDs returned
- [ ] KYC flow completes end-to-end (or documented sandbox equivalent)
- [ ] Escrow funded with test BOB — confirm balance visible via wallet query
- [ ] (If built) Yield deposit + withdrawal round-trips correctly on a small test amount
- [ ] Milestone approval correctly triggers release — confirm freelancer wallet balance updates
- [ ] All SDK request/response pairs logged and screenshotted for submission
- [ ] Full user journey run start-to-finish on testnet, screen-recorded for demo video

---

## 12. Timeline (from now, ~36 hrs to submission deadline)

| Block | Focus |
|---|---|
| Hrs 0–4 | SDK setup, wallet + KYC flow working |
| Hrs 4–8 | Escrow funding + BOB ramp integration, tested on testnet |
| Hrs 8–12 | Milestone + release logic |
| Hrs 12–16 | Yield integration (if time), UI polish on status screens |
| Hrs 16–20 | Cash-out info screen, transaction log screen |
| Final stretch | README with SDK proof, demo video, submission |

**Cut order if behind schedule:** x402 stretch → yield integration → multi-milestone (fall back to single milestone) → UI polish. Never cut: real SDK wallet/escrow/release calls — that's what's being judged.
