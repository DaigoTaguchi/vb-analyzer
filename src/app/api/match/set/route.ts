import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const SetRequestBodySchema = z.object({
  matchId: z.number(),
  setNumber: z.number(),
  homeTeamScore: z.number(),
  opponentTeamScore: z.number(),
  isWon: z.boolean(),
  orderMembers: z.array(
    z.object({
      rotation: z.number(),
      playerId: z.number(),
    })
  ),
});

// team 一覧の情報を入力されたときに呼び出される API
// DB に既に team が存在するかどうかを確認して、存在している場合はエラーを返す
export async function POST(req: Request) {
  const body = await req.json();
  const result = SetRequestBodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const {
    matchId,
    setNumber,
    homeTeamScore,
    opponentTeamScore,
    isWon,
    orderMembers,
  } = result.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const set = await tx.sets.create({
        data: {
          setNumber,
          homeTeamScore,
          opponentTeamScore,
          isWon,
          matchId,
        },
      });
    });

    return NextResponse.json(
      { message: "match created successfully" },
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
