import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: { jobsAsClient: { include: { milestones: true } } },
    });

    const jobs = await prisma.job.findMany({
      include: { milestones: true, transactions: true },
      orderBy: { createdAt: "desc" },
    });

    const logs = await prisma.appLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            role: user.role,
            country: user.country,
            pollarWalletId: user.pollarWalletId,
            walletAddress: user.walletAddress,
            kycStatus: user.kycStatus,
          }
        : null,
      jobs: jobs.map((j) => ({
        id: j.id,
        clientId: j.clientId,
        freelancerId: j.freelancerId,
        title: j.title,
        description: j.description,
        amountBOB: j.amountBOB.toString(),
        amountUSDC: j.amountUSDC?.toString() ?? null,
        status: j.status,
        escrowWalletId: j.escrowWalletId,
        yieldEnabled: j.yieldEnabled,
        createdAt: j.createdAt.toISOString(),
        milestones: j.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          status: m.status,
          order: m.order,
        })),
        transactions: j.transactions.map((t) => ({
          id: t.id,
          pollarTxId: t.pollarTxId,
          amount: t.amount.toString(),
          currency: t.currency,
          type: t.type,
          timestamp: t.createdAt.toISOString(),
        })),
      })),
      logs: logs.map((l) => ({
        id: l.id,
        action: l.action,
        jobId: l.jobId,
        payload: l.payload,
        timestamp: l.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[API] /api/state GET error:", error);
    return NextResponse.json({ user: null, jobs: [], logs: [] }, { status: 200 });
  }
}