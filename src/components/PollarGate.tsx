"use client";
import { useState } from "react";
import { PollarProvider } from "@pollar/react";
import { getPollarClient } from "@/lib/pollar-client";
import "@pollar/react/styles.css";

export function PollarGate({ children }: { children: React.ReactNode }) {
  // Singleton is cached; safe to construct during SSR (SDK logs a harmless
  // warning). Must always wrap so usePollar() never throws during prerender.
  const [client] = useState(() => getPollarClient());

  return <PollarProvider client={client}>{children}</PollarProvider>;
}
