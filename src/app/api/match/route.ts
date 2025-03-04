import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const MatchRequestBodySchema = z.object({
  title: z.string(),
  teamId: z.number(),
  opponentTeamName: z.string(),
  setLength: z.number(),
});

// team 一覧の情報を入力されたときに呼び出される API
// DB に既に team が存在するかどうかを確認して、存在している場合はエラーを返す
export async function POST(req: Request) {
  const body = await req.json();
  const result = MatchRequestBodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { title, opponentTeamName, setLength, teamId } = result.data;

  try {
    const match = await prisma.matches.create({
      data: {
        title,
        teamId,
        opponentTeamName,
        setLength,
      },
    });
    return NextResponse.json(
      { message: "match created successfully", matchId: match.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
