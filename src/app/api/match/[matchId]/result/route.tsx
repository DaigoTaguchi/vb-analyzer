import { prisma } from "@/lib/prisma";
import {
  Matches,
  OrderMembers,
  Players,
  Sets,
  SpikeStats,
  Teams,
} from "@prisma/client";
import { NextResponse } from "next/server";

// Sets に関連する型の定義
type SetsResult = Sets & {
  matches: Matches & {
    teams: Teams;
  };
  orderMembers: (OrderMembers & {
    players: Players;
    spikeStats: SpikeStats | null;
  })[];
};

// スパイクの結果に関する型
type SpikeCountResult = {
  playerId: number;
  playerName: string;
  totalSpikes: number;
  totalSuccessSpikes: number;
  totalMissSpikes: number;
};

// レスポンス全体の型定義
export type FetchResultResponse = {
  message: string;
  sets: SetsResult[];
  result: SpikeCountResult[];
};

// レスポンス全体の型定義
type FetchErrorResponse = {
  error: string;
};

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
): Promise<NextResponse<FetchResultResponse | FetchErrorResponse>> {
  const matchId = parseInt(params.matchId, 10);
  if (isNaN(matchId)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  try {
    const sets = await prisma.sets.findMany({
      where: { matchId },
      include: {
        matches: {
          include: {
            teams: true,
          },
        },
        orderMembers: {
          include: {
            players: true,
            spikeStats: true,
          },
        },
      },
    });

    if (sets.length === 0) {
      return NextResponse.json({ error: "sets not found" }, { status: 404 });
    }

    // 選手ごとのスパイクの結果
    const result = await getSpikeCountsByMatch(matchId);

    return NextResponse.json(
      { message: "fetch result data succeeded", sets, result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching matches", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getSpikeCountsByMatch(matchId: number) {
  const matchResults = await prisma.matches.findFirst({
    where: {
      id: matchId,
    },
    include: {
      sets: {
        include: {
          orderMembers: {
            include: {
              players: true,
              spikeStats: true,
            },
          },
        },
      },
    },
  });

  if (!matchResults) {
    return [];
  }

  // 選手ごとのスパイクデータを集計するためのマップ
  const playerSpikeData: Map<number, SpikeCountResult> = new Map();

  // sets をループして、各セットの orderMembers を確認
  matchResults.sets.forEach((set) => {
    set.orderMembers.forEach((order) => {
      const player = order.players; // 選手情報
      const spikeStats = order.spikeStats; // スパイク統計データ

      if (spikeStats) {
        const playerId = player.id;
        const playerName = player.name;

        // プレイヤーのスパイクデータがマップにすでにあるかチェック
        if (!playerSpikeData.has(playerId)) {
          // プレイヤーのデータがマップにない場合、新しく追加
          playerSpikeData.set(playerId, {
            playerId,
            playerName,
            totalSpikes: 0,
            totalSuccessSpikes: 0,
            totalMissSpikes: 0,
          });
        }

        // プレイヤーのスパイクデータを更新
        const currentData = playerSpikeData.get(playerId)!;
        currentData.totalSpikes += spikeStats.spikes ?? 0;
        currentData.totalSuccessSpikes += spikeStats.spikeSuccesses ?? 0;
        currentData.totalMissSpikes += spikeStats.spikeMistakes ?? 0;
      }
    });
  });

  // マップから SpikeCountResult の配列を返す
  return Array.from(playerSpikeData.values());
}
