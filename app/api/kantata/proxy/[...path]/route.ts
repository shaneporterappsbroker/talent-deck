export const runtime = "nodejs"; // 🛠️ Force Node.js runtime to avoid async `params` issue

import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { params } = context;
  const endpoint = (await params).path.join("/");

  const url = `${process.env.KANTATA_API_BASE_URL}${endpoint}?${req.nextUrl.searchParams.toString()}`;

  const session = await getServerSession(authOptions);

  const kantataRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.kantataAccessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await kantataRes.json();
  return NextResponse.json(data, { status: kantataRes.status });
}
