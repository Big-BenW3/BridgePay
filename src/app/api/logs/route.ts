import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, jobId, payload } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    const log = await prisma.appLog.create({
      data: {
        action,
        jobId,
        payload: payload ?? {},
      },
    });

    return NextResponse.json({
      id: log.id,
      action: log.action,
      jobId: log.jobId,
      payload: log.payload,
      timestamp: log.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("[API] /api/logs POST error:", error);
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}