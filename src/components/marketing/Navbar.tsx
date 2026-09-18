"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-6 z-30 mx-auto max-w-[1200px] px-6 transition-all duration-300 ${isScrolled ? "opacity-90" : "opacity-100"}`}>
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="BridgePay Home">
          <Image src="/bridgepay-logo.png" alt="BridgePay" width={1408} height={676} className="h-8 w-auto" priority />
        </Link>

        <nav className="nav-pill flex items-center gap-4 hidden md:flex" aria-label="Main navigation">
          <Link href="#problem" className="nav-link">The Problem</Link>
          <Link href="#how-it-works" className="nav-link">How it Works</Link>
          <Link href="#why" className="nav-link">Why BridgePay</Link>
          <Link href="/app" className="nav-link">Dashboard</Link>
          <span className="lang-toggle">EN</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/onboarding">
            <button className="btn-primary hidden md:block">Start escrow</button>
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-ash-surface)] hover:bg-[var(--color-fog)] transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] mb-1.5 transition-all duration-300 ease-out" style={{ transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] mb-1.5 transition-all duration-300 ease-out" style={{ opacity: mobileOpen ? "0" : "1" }} />
            <span className="hamburger-line block w-5 h-0.5 bg-[var(--color-graphite)] transition-all duration-300 ease-out" style={{ transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
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
