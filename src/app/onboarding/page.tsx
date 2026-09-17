"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePollar, WalletButton } from "@pollar/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { upsertUser, pushLog, type UserState, getState } from "@/lib/api";

export default function OnboardingPage() {
  const { isAuthenticated, wallet, openKycModal, openLoginModal, logout } = usePollar();
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [user, setUser] = useState<UserState>(null);

  useEffect(() => {
    getState().then((s) => setUser(s.user)).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (isAuthenticated && wallet?.address) {
      pushLog("wallet_connected", `${wallet.address.slice(0, 10)}…`, { address: wallet.address });
      const newUser = {
        id: wallet.address,
        role,
        country: role === "client" ? "BO" : "NG",
        pollarWalletId: wallet.address,
        walletAddress: wallet.address,
        kycStatus: "pending" as const,
      };
      upsertUser(newUser);
      setUser(newUser);
    }
  }, [isAuthenticated, wallet, role]);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="mx-auto max-w-[760px] px-6 py-10">
        <Link href="/" className="text-sm font-medium text-[#862fe7] hover:underline">← Home</Link>
        <div className="fluid-enter">
          <h1 className="font-display text-[30px] font-semibold tracking-tight mt-6">Set up your wallet</h1>
          <p className="text-sm text-[#6b7589] mt-2">Pick a role, then connect with Pollar. One Stellar wallet works for both sides.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8 fluid-enter-stagger">
          {(["client", "freelancer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`text-left double-bezel hover ${role === r ? "" : "border-transparent"}`}
              style={{ gridColumn: "span 1" }}
            >
              <div className="core p-5">
                <p className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: role === r ? "#862fe7" : "#6b7589" }}>
                  {r === "client" ? "Bolivia • Client" : "Nigeria • Freelancer"}
                </p>
                <p className="font-semibold mt-2">{r === "client" ? "Fund work in BOB" : "Receive USDC"}</p>
                <p className="text-xs text-[#6b7589] mt-1">{r === "client" ? "Lock escrow until approved." : "Instant payout on approval."}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 fluid-enter-fast">
          <Card className="hover" style={{ gridColumn: "span 1" }}>
            <div className="core p-6">
              <h3 className="font-semibold text-sm">Pollar wallet</h3>
              <p className="text-xs text-[#6b7589] mt-1">Real Stellar wallet via Pollar — no seed shown, fees sponsored.</p>
              <div className="mt-4 p-4 rounded-[16px] bg-[#f1f5f9] border border-[#d8e0ea]">
                <WalletButton />
                {!isAuthenticated ? (
                  <Button size="sm" className="mt-3" onClick={() => openLoginModal()}>
                    Connect wallet →
                  </Button>
                ) : (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-xs bg-white border border-[#d8e0ea] rounded-full px-3 py-1.5 flex-1 truncate">{wallet?.address}</p>
                    <Button size="sm" variant="ghost" onClick={() => logout()}>
                      Logout
                    </Button>
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-5 rounded-[16px] bg-white border border-[#d8e0ea] p-4">
                  <p className="text-sm font-medium">Verify identity</p>
                  <p className="text-xs text-[#6b7589] mt-1">Required before funding. One tap opens Pollar's KYC.</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => openKycModal({ country: role === "client" ? "BO" : "NG", level: "basic" })}>
                      Verify
                    </Button>
                    <Link href="/app">
                      <Button size="sm" variant="ghost">Continue →</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <p className="text-center text-xs text-[#6b7589] mt-6"><Link href="/app" className="underline">Skip to dashboard</Link> — you can connect later.</p>
      </div>
    </div>
  );
}