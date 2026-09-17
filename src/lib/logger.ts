export type LogEntry = {
  action: string;
  jobId?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
};

const memoryLog: LogEntry[] = [];

export function logAction(entry: Omit<LogEntry, "timestamp">) {
  const full: LogEntry = { ...entry, timestamp: new Date().toISOString() };
  memoryLog.push(full);
  // also console for dev
  console.log(`[BridgePay] ${full.action}`, full.payload ?? "");
  return full;
}

export function getLogs() {
  return memoryLog.slice().reverse();
}

