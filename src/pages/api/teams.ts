import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  teams?: { id: number; name: string }[];
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // GET で呼び出された場合は team の一覧を返す
  if (req.method !== "GET") {
    return res.status(405).json({ message: "invalid method" });
  }

  try {
    const teams = await prisma.teams.findMany();
    return res
      .status(200)
      .json({ message: "fetch teams data succeeded", teams });
  } catch (error) {
    console.error("Error fetching teams", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
