import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const StatsBodySchema = z.object({
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
    const stats = result.data.stats;
    if (stats.length > 0) {
      await prisma.matchStats.createMany({
        data: stats,
      });
    }

    return NextResponse.json(
      { message: "stats create successfully" },
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
