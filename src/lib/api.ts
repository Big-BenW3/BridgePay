export type UserState = {
  id: string;
  role: "client" | "freelancer";
  country: string;
  pollarWalletId: string | null;
  walletAddress: string | null;
  kycStatus: "pending" | "approved" | "rejected";
} | null;

export type MilestoneState = {
  id: string;
  title: string;
  status: "pending" | "submitted" | "approved";
  order: number;
};

export type JobState = {
  id: string;
  clientId: string;
  freelancerId?: string;
  title: string;
  description: string;
  amountBOB: string;
  amountUSDC: string | null;
  status: "open" | "funded" | "in_progress" | "approved" | "released" | "closed";
  escrowWalletId?: string;
  yieldEnabled: boolean;
  createdAt: string;
  milestones: MilestoneState[];
  transactions: Array<{
    id: string;
    pollarTxId?: string;
    amount: string;
    currency: string;
    type: "fund" | "release" | "yield_deposit" | "yield_withdraw";
    timestamp: string;
  }>;
};

export type LogState = {
  id: string;
  action: string;
  jobId?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
};

export type FullState = {
  user: UserState;
  jobs: JobState[];
  logs: LogState[];
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function getState(): Promise<FullState> {
  return fetchJson<FullState>("/api/state");
}

export async function upsertUser(user: Exclude<UserState, null>): Promise<UserState> {
  return fetchJson<UserState>("/api/user", { method: "POST", body: JSON.stringify(user) });
}

export async function upsertJob(job: JobState): Promise<JobState> {
  return fetchJson<JobState>("/api/jobs", { method: "POST", body: JSON.stringify(job) });
}

export async function pushLog(action: string, jobId: string | undefined, payload?: Record<string, unknown>): Promise<LogState> {
  return fetchJson<LogState>("/api/logs", { method: "POST", body: JSON.stringify({ action, jobId, payload }) });
}