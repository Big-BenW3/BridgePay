import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, role, country, pollarWalletId, walletAddress, kycStatus } = body;

    if (!id || !role || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        role,
        country,
        pollarWalletId,
        walletAddress,
        kycStatus: kycStatus ?? "pending",
      },
      create: {
        id,
        role,
        country,
        pollarWalletId,
        walletAddress,
        kycStatus: kycStatus ?? "pending",
      },
    });

    return NextResponse.json({
      id: user.id,
      role: user.role,
      country: user.country,
      pollarWalletId: user.pollarWalletId,
      walletAddress: user.walletAddress,
      kycStatus: user.kycStatus,
    });
  } catch (error) {
    console.error("[API] /api/user POST error:", error);
    return NextResponse.json({ error: "Failed to upsert user" }, { status: 500 });
  }
}