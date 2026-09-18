"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-6 z-30 mx-auto max-w-[1200px] px-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-polysans text-[18px] font-medium text-[var(--color-graphite)] tracking-[-0.02em]" aria-label="BridgePay Home">
          BridgePay
        </Link>

        <nav className="nav-pill flex items-center gap-4 hidden md:flex" aria-label="Main navigation">
          <Link href="#problem" className="nav-link">The Problem</Link>
          <Link href="#how-it-works" className="nav-link">How it Works</Link>
          <Link href="#why" className="nav-link">Why BridgePay</Link>
          <Link href="/app" className="nav-link">Dashboard</Link>
          <span className="lang-toggle">EN</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/onboarding"><button className="btn-primary">Start escrow</button></Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-ash-surface)] hover:bg-[var(--color-fog)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] mb-1.5 transition-all duration-300 ease-out" />
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] mb-1.5 transition-all duration-300 ease-out" />
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] transition-all duration-300 ease-out" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 md:hidden flex flex-col items-center justify-center gap-6 px-6 transition-opacity duration-300 ease-out ${mobileOpen ? "opacity-100 pointer-events-auto bg-white" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="w-full max-w-sm text-center animate-in slide-in-from-top-4 duration-400 ease-out" onClick={e => e.stopPropagation()}>
          <h2 id="mobile-menu-title" className="sr-only">Mobile Menu</h2>
          <Link href="/onboarding" className="block w-full py-4" onClick={() => setMobileOpen(false)}>
            <button className="btn-primary w-full">Start escrow</button>
          </Link>
          <nav className="flex flex-col gap-4 text-center">
            <Link href="#problem" className="nav-link text-lg" onClick={() => setMobileOpen(false)}>The Problem</Link>
            <Link href="#how-it-works" className="nav-link text-lg" onClick={() => setMobileOpen(false)}>How it Works</Link>
            <Link href="#why" className="nav-link text-lg" onClick={() => setMobileOpen(false)}>Why BridgePay</Link>
            <Link href="/app" className="nav-link text-lg" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link href="/onboarding" className="block w-full py-4 mt-4" onClick={() => setMobileOpen(false)}>
              <button className="btn-ghost w-full">Sign in</button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}