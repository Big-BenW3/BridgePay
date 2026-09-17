export function Badge({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet"|"mint"|"dark"|"amber" }) {
  const tones: Record<string,string> = {
    violet: "bg-[#ebdafd] text-[#5f259e] border border-[#d8e0ea]",
    mint: "bg-[#d6fcf4] text-[#111827] border border-[#d8e0ea]",
    dark: "bg-[#1f2534] text-white",
    amber: "bg-[#fef3c7] text-[#92400e]",
  };
  return <span className={`inline-flex items-center px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase rounded-full transition-[transform,opacity] duration-[140ms] ease-[var(--ease-out)] ${tones[tone]}`}>{children}</span>;
}
export function StatusPill({ status }: { status: string }) {
  const map: Record<string,string> = {
    open: "bg-white border border-[#d8e0ea] text-[#3f4654]",
    funded: "bg-[#ebdafd] text-[#5f259e] border border-[#ad6df4]",
    in_progress: "bg-[#d6fcf4] text-[#065f46] border border-[#a7f3d0]",
    approved: "bg-[#d1fae5] text-[#065f46] border border-[#86efac]",
    released: "bg-[#862fe7] text-white border border-[#7a2ad3]",
    closed: "bg-[#111827] text-white",
    pending: "bg-[#f1f5f9] text-[#6b7589] border border-[#d8e0ea]",
    submitted: "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]",
  };
  return <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-[transform,opacity,background-color] duration-[180ms] ease-[var(--ease-out)] ${map[status] ?? map.pending}`}>{status.replace("_"," ")}</span>;
}
