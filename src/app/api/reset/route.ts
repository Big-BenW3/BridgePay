import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    await prisma.escrowTransaction.deleteMany({});
    await prisma.milestone.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.appLog.deleteMany({});
    await prisma.user.deleteMany({});
    return NextResponse.json({ ok: true, message: "Database reset complete" });
  } catch (error) {
    console.error("[API] /api/reset error:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}