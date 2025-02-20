import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // クエリで teamId を受け取って、そのチームに所属する選手の一覧を返す
  const query = req.nextUrl.searchParams;
  const teamId = query.get("teamId");

  if (!teamId) {
    return NextResponse.json({ message: "invalid teamId" }, { status: 400 });
  }

  try {
    const players = await prisma.players.findMany({
      where: {
        teamId: parseInt(teamId),
      },
    });
    return NextResponse.json(
      { message: "fetch players data succeeded", players },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching players", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
