import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import { PollarGate } from "@/components/PollarGate";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BridgePay — Cross-border Freelance Escrow on Pollar",
  description:
    "Fund in BOB via Pollar, hold in Stellar escrow, release instantly as USDC to Nigeria. Non-custodial, milestone-protected.",
  openGraph: {
    title: "BridgePay — Freelance escrow Bolivia → Nigeria",
    description: "Milestone escrow built on Pollar SDK + Stellar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${geist.variable} antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <PollarGate>{children}</PollarGate>
      </body>
    </html>
  );
}

