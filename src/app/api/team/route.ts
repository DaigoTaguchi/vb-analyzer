import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const RequestBodySchema = z.object({
  teamName: z.string(),
  players: z.array(z.string()),
});

// team 一覧の情報を入力されたときに呼び出される API
// DB に既に team が存在するかどうかを確認して、存在している場合はエラーを返す
export async function POST(req: Request) {
  const body = await req.json();
  const result = RequestBodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { teamName, players } = result.data;

  try {
    const existingTeam = await prisma.teams.findFirst({
      where: {
        name: teamName,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { message: "Team name already exists" },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const newTeam = await tx.teams.create({
        data: {
          name: teamName,
        },
      });

      if (players.length > 0) {
        await tx.players.createMany({
          data: players.map((name) => ({ name, teamId: newTeam.id })),
        });
      }
    });

    return NextResponse.json(
      { message: "team and players created successfully" },
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
