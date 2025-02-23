import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const SetRequestBodySchema = z.object({
  matchId: z.number(),
  setNumber: z.number(),
  homeTeamScore: z.number(),
  opponentTeamScore: z.number(),
  orderMembers: z.array(
    z.object({
      rotation: z.number(),
      playerId: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  const result = SetRequestBodySchema.safeParse(body);
  console.log(result.error);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { matchId, setNumber, homeTeamScore, opponentTeamScore, orderMembers } =
    result.data;
  const isWon = homeTeamScore > opponentTeamScore;

  try {
    const set = await prisma.$transaction(async (tx) => {
      const createdSet = await tx.sets.create({
        data: {
          setNumber,
          homeTeamScore,
          opponentTeamScore,
          isWon,
          matchId,
        },
      });

      await tx.orderMembers.createMany({
        data: orderMembers.map((member) => ({
          rotation: member.rotation,
          playerId: member.playerId,
          setId: createdSet.id,
        })),
      });
      return createdSet;
    });

    return NextResponse.json(
      { message: "set and orderMember created successfully", setId: set.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating set and orderMember", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
