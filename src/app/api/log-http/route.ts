import { prisma } from "db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { statusCode, method, url, ipAddress, message, userAgent } =
    await req.json();
  try {
    await prisma.httpErrorLog.create({
      data: { statusCode, method, url, ipAddress, message, userAgent },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save HTTP log:", err);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}
