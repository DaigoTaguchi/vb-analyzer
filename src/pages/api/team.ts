import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type ResponseData = {
  message: string;
};

const RequestBodySchema = z.object({
  teamName: z.string(),
  players: z.array(z.string()),
});

const prisma = new PrismaClient();

// team 一覧の情報を入力されたときに呼び出される API
// DB に既に team が存在するかどうかを確認して、存在している場合はエラーを返す
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "invalid method" });
  }

  // body で受け取ったデータをバリデーション
  const result = RequestBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { teamName, players } = result.data;

  try {
    const existingTeam = await prisma.teams.findFirst({
      where: {
        name: teamName,
      },
    });

    if (existingTeam) {
      return res.status(409).json({ message: "Team name already exists" });
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

    return res
      .status(201)
      .json({ message: "team and players created successfully" });
  } catch (error) {
    console.error("Error creating team", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
