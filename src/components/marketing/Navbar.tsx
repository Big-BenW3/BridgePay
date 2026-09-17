"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-40 noise-overlay" />
      <header className="relative z-30">
        <nav className="fluid-island flex items-center justify-between px-4 py-3 transition-all duration-300 ease-[var(--ease-out)]" style={{ boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.1) inset" : "0 4px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.1) inset" }}>
          <Link href="/" className="flex items-center gap-2" aria-label="BridgePay Home">
            <span className="w-8 h-8 rounded-[10px] bg-[#862fe7] grid place-items-center text-white text-[14px] font-bold" aria-hidden="true">◆</span>
            <span className="font-semibold text-[17px] tracking-tight text-[#111827]">BridgePay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#problem" className="text-[14px] font-medium text-[#3f4654] hover:text-[#862fe7] transition-colors duration-200 ease-[var(--ease-out)]">The Problem</Link>
            <Link href="#how-it-works" className="text-[14px] font-medium text-[#3f4654] hover:text-[#862fe7] transition-colors duration-200 ease-[var(--ease-out)]">How it Works</Link>
            <Link href="#why" className="text-[14px] font-medium text-[#3f4654] hover:text-[#862fe7] transition-colors duration-200 ease-[var(--ease-out)]">Why BridgePay</Link>
            <Link href="/app" className="text-[14px] font-medium text-[#3f4654] hover:text-[#862fe7] transition-colors duration-200 ease-[var(--ease-out)]">Dashboard</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/app" className="hidden sm:block text-sm font-medium text-[#111827] hover:text-[#862fe7] transition-colors">Sign in</Link>
            <Link href="/onboarding"><Button size="sm" magnetic>Start escrow</Button></Link>

            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#f1f5f9] hover:bg-[#e8eef5] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
            >
              <span className="hamburger-line block w-5 h-0.5 bg-[#111827] mb-1.5 transition-all duration-300 ease-[var(--ease-spring)]" />
              <span className="hamburger-line block w-5 h-0.5 bg-[#111827] mb-1.5 transition-all duration-300 ease-[var(--ease-spring)]" />
              <span className="hamburger-line block w-5 h-0.5 bg-[#111827] transition-all duration-300 ease-[var(--ease-spring)]" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          id="mobile-menu"
          className={`fixed inset-0 z-50 md:hidden flex flex-col items-center justify-center gap-8 px-6 modal-backdrop transition-opacity duration-300 ease-[var(--ease-out)] ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="w-full max-w-sm text-center animate-in slide-in-from-top-4 duration-400 ease-[var(--ease-fluid)]" onClick={e => e.stopPropagation()}>
            <h2 id="mobile-menu-title" className="sr-only">Mobile Menu</h2>
            <Link href="/onboarding" className="block w-full py-4" onClick={() => setMobileOpen(false)}><Button size="lg">Start escrow →</Button></Link>
            <nav className="flex flex-col gap-4 text-center">
              <Link href="#problem" className="text-lg font-medium text-[#111827] hover:text-[#862fe7] transition-colors" onClick={() => setMobileOpen(false)}>The Problem</Link>
              <Link href="#how-it-works" className="text-lg font-medium text-[#111827] hover:text-[#862fe7] transition-colors" onClick={() => setMobileOpen(false)}>How it Works</Link>
              <Link href="#why" className="text-lg font-medium text-[#111827] hover:text-[#862fe7] transition-colors" onClick={() => setMobileOpen(false)}>Why BridgePay</Link>
              <Link href="/app" className="text-lg font-medium text-[#111827] hover:text-[#862fe7] transition-colors" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link href="/app" className="block w-full py-4 mt-4" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="lg">Sign in</Button></Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}