import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { PollarGate } from "@/components/PollarGate";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-polysans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <PollarGate>{children}</PollarGate>
      </body>
    </html>
  );
}