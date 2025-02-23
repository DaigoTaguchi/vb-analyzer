import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const teams = await prisma.teams.findMany();
    return NextResponse.json(
      { message: "fetch teams data succeeded", teams },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teams", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
