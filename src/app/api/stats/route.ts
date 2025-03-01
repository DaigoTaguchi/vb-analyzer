import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const StatsBodySchema = z.object({
  set: z.object({
    id: z.number(),
    homeTeamScore: z.number(),
    opponentTeamScore: z.number(),
    isWon: z.boolean(),
  }),
  stats: z.array(
    z.object({
      spikes: z.number(),
      spikeSuccesses: z.number(),
      spikeMistakes: z.number(),
      orderMemberId: z.number(),
    })
  ),
});

// team 一覧の情報を入力されたときに呼び出される API
// DB に既に team が存在するかどうかを確認して、存在している場合はエラーを返す
export async function POST(req: Request) {
  const body = await req.json();
  const result = StatsBodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    // セットの統計データを登録
    const stats = result.data.stats;
    if (stats.length > 0) {
      await prisma.matchStats.createMany({
        data: stats,
      });
    }

    const { id, homeTeamScore, opponentTeamScore, isWon } = result.data.set;
    // セットの結果を更新
    await prisma.sets.update({
      where: { id },
      data: {
        homeTeamScore,
        opponentTeamScore,
        isWon,
      },
    });

    // 次のセットがあるかどうかを判定する
    const orderMember = await prisma.orderMembers.findFirst({
      where: { id: result.data.stats[0].orderMemberId },
      include: {
        sets: {
          include: {
            matches: true,
          },
        },
      },
    });

    if (!orderMember) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    const match = orderMember.sets.matches;
    console.log("matchId:" + match.id);

    const matchLength = match.setLength;
    const setCount = await prisma.sets.count({ where: { matchId: match.id } });
    console.log("セット数: " + setCount);
    const winCount = await prisma.sets.count({
      where: { matchId: match.id, isWon: true },
    });
    console.log("得セット数: " + winCount);
    const loseCount = setCount - winCount;
    console.log("失セット数: " + loseCount);

    if (winCount > matchLength / 2 || loseCount > matchLength / 2) {
      return NextResponse.json(
        { message: "stats create successfully", isFinish: true },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "stats create successfully", isFinish: false },
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
