import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type ResponseData = {
  message: string;
};

const MatchRequestBodySchema = z.object({
  title: z.string(),
  homeTeamName: z.string(),
  teamId: z.number(),
  opponentTeamName: z.string(),
  setNum: z.number(),
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

  const result = MatchRequestBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { title, homeTeamName, opponentTeamName, setNum, teamId } = result.data;

  try {
    await prisma.matches.create({
      data: {
        title,
        homeTeamName,
        teamId,
        opponentTeamName,
        setNum,
      },
    });
    return res.status(201).json({ message: "match created successfully" });
  } catch (error) {
    console.error("Error creating team", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
