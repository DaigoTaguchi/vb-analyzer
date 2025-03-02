import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const teamId = parseInt(params.teamId, 10);
  if (isNaN(teamId)) {
    return NextResponse.json({ error: "Invalid teamId" }, { status: 400 });
  }

  console.log(teamId);

  try {
    const matches = await prisma.matches.findMany({
      where: { teamId },
    });
    return NextResponse.json(
      { message: "fetch matches data succeeded", matches },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching matches", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
