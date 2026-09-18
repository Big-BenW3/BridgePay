"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePollar, WalletButton } from "@pollar/react";
import { upsertUser, pushLog } from "@/lib/api";

export default function OnboardingPage() {
  const { isAuthenticated, wallet, openKycModal, logout } = usePollar();
  const [role, setRole] = useState<"client" | "freelancer">("client");

  useEffect(() => {
    if (isAuthenticated && wallet?.address) {
      pushLog("wallet_connected", `${wallet.address.slice(0, 10)}…`, { address: wallet.address });
      upsertUser({
        id: wallet.address,
        role,
        country: role === "client" ? "BO" : "NG",
        pollarWalletId: wallet.address,
        walletAddress: wallet.address,
        kycStatus: "pending" as const,
      });
    }
  }, [isAuthenticated, wallet, role]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[760px] px-6 py-10">
        <Link href="/" className="link-ember font-polysans text-[13px] mb-8 block w-fit">← Home</Link>

        <div className="mb-10">
          <h1 className="font-polysans text-[40px] leading-[1.2] tracking-[-0.8px] text-[var(--color-graphite)] font-medium">
            Set up your wallet
          </h1>
          <p className="mt-3 text-[18px] leading-[1.25] text-[var(--color-steel)]">
            Pick a role, then connect with Pollar. One Stellar wallet works for both sides.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-[var(--element-gap)] mb-10">
          {(["client", "freelancer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`card p-6 transition-colors duration-200 ${role === r ? "border-2 border-[var(--color-ember-orange)]" : "border-transparent hover:border-[var(--color-mist)]"}`}
              style={{ borderWidth: role === r ? '2px' : '1px', borderStyle: 'solid', borderColor: 'transparent' }}
            >
              <p className={`font-polysans text-[13px] font-medium tracking-[0.1em] uppercase ${role === r ? "text-[var(--color-ember-orange)]" : "text-[var(--color-slate)]"}`}>
                {r === "client" ? "Bolivia • Client" : "Nigeria • Freelancer"}
              </p>
              <p className="mt-2 font-polysans text-[18px] font-medium text-[var(--color-graphite)]">
                {r === "client" ? "Fund work in BOB" : "Receive USDC"}
              </p>
              <p className="mt-1 text-[14px] text-[var(--color-slate)]">
                {r === "client" ? "Lock escrow until approved." : "Instant payout on approval."}
              </p>
            </button>
          ))}
        </div>

        <div className="card">
          <h3 className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] mb-2">
            Pollar wallet
          </h3>
          <p className="text-[14px] text-[var(--color-steel)] mb-4">
            Real Stellar wallet via Pollar — no seed shown, fees sponsored.
          </p>

          <div className="mb-4">
            <WalletButton />
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-mono text-[13px] bg-[var(--surface-page-canvas)] border border-[var(--color-mist)] rounded-full px-3 py-1.5 flex-1 truncate">
                {wallet?.address}
              </p>
              <button className="btn-ghost" onClick={() => logout()}>Logout</button>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-6 p-4 bg-[var(--surface-page-canvas)] rounded-[var(--radius-cards)] border border-[var(--color-mist)]">
              <p className="font-polysans text-[15px] font-medium text-[var(--color-graphite)] mb-1">
                Verify identity
              </p>
              <p className="text-[13px] text-[var(--color-slate)] mb-3">
                Required before funding. One tap opens Pollar&apos;s KYC.
              </p>
              <div className="flex gap-3">
                <button
                  className="btn-primary"
                  onClick={() => openKycModal({ country: role === "client" ? "BO" : "NG", level: "basic" })}
                >
                  Verify
                </button>
                <Link href="/app"><button className="btn-ghost">Continue</button></Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[13px] text-[var(--color-slate)] mt-8">
          <Link href="/app" className="link-ember">Skip to dashboard</Link> — you can connect later.
        </p>
      </div>
    </div>
  );
}