import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, clientId, freelancerId, title, description, amountBOB, amountUSDC, status, milestones, transactions, escrowWalletId, yieldEnabled } = body;

    if (!id || !clientId || !title || !description || !amountBOB || !status || !Array.isArray(milestones)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await prisma.job.upsert({
      where: { id },
      update: {
        freelancerId,
        title,
        description,
        amountBOB: new Prisma.Decimal(amountBOB),
        amountUSDC: amountUSDC ? new Prisma.Decimal(amountUSDC) : undefined,
        status,
        escrowWalletId,
        yieldEnabled: yieldEnabled ?? false,
        milestones: {
          deleteMany: {},
          create: milestones.map((m: any, idx: number) => ({
            id: m.id,
            title: m.title,
            status: m.status,
            order: m.order ?? idx,
          })),
        },
      },
      create: {
        id,
        clientId,
        freelancerId,
        title,
        description,
        amountBOB: new Prisma.Decimal(amountBOB),
        amountUSDC: amountUSDC ? new Prisma.Decimal(amountUSDC) : undefined,
        status,
        escrowWalletId,
        yieldEnabled: yieldEnabled ?? false,
        milestones: {
          create: milestones.map((m: any, idx: number) => ({
            id: m.id,
            title: m.title,
            status: m.status,
            order: m.order ?? idx,
          })),
        },
      },
      include: { milestones: true },
    });

    // Persist escrow transactions (fund/release hashes) so they survive reload.
    // Client sends the full array; upsert by id to dedupe across polls.
    if (Array.isArray(transactions)) {
      for (const t of transactions) {
        if (!t?.id || !t?.amount || !t?.currency || !t?.type) continue;
        try {
          await prisma.escrowTransaction.upsert({
            where: { id: String(t.id) },
            update: {},
            create: {
              id: String(t.id),
              jobId: id,
              pollarTxId: t.pollarTxId ? String(t.pollarTxId) : undefined,
              amount: new Prisma.Decimal(String(t.amount)),
              currency: String(t.currency),
              type: t.type,
            },
          });
        } catch {
          // ignore duplicates / malformed rows — never block the job write
        }
      }
    }

    const savedTx = await prisma.escrowTransaction.findMany({
      where: { jobId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      id: job.id,
      clientId: job.clientId,
      freelancerId: job.freelancerId,
      title: job.title,
      description: job.description,
      amountBOB: job.amountBOB.toString(),
      amountUSDC: amountUSDC ?? job.amountUSDC?.toString() ?? null,
      status: job.status,
      escrowWalletId: job.escrowWalletId,
      yieldEnabled: job.yieldEnabled,
      createdAt: job.createdAt.toISOString(),
      milestones: job.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        order: m.order,
      })),
      transactions: savedTx.map((t) => ({
        id: t.id,
        pollarTxId: t.pollarTxId,
        amount: t.amount.toString(),
        currency: t.currency,
        type: t.type,
        timestamp: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[API] /api/jobs POST error:", error);
    return NextResponse.json({ error: "Failed to upsert job" }, { status: 500 });
  }
}