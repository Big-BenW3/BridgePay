"use client";
import { PollarClient } from "@pollar/core";

// Singleton client — reads from NEXT_PUBLIC_ vars (exposed to browser)
// Only constructs on client to avoid SSR "browser APIs unavailable" warning.
let client: PollarClient | null = null;

export function getPollarClient(): PollarClient {
  if (client) return client;
  const apiKey =
    process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_POLLAR_API_KEY ||
    process.env.Pollar_API_KEY ||
    process.env.POLLAR_API_KEY ||
    "";
  const network = (process.env.NEXT_PUBLIC_POLLAR_NETWORK || process.env.Pollar_NETWORK || process.env.NEXT_PUBLIC_POLLAR_NETWORK || "testnet") as "testnet" | "mainnet";

  if (!apiKey) {
    console.warn("[Pollar] NEXT_PUBLIC_POLLAR_API_KEY missing — set it in .env.local and Vercel. Falling back to server env.");
  }

  client = new PollarClient({
    apiKey: apiKey || "missing-key-will-error-on-auth",
    stellarNetwork: network,
  });
  return client;
}