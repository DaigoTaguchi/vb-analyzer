"use client";
import AttackDialog from "@/app/components/DIalog";
import { OrderMembers, Players } from "@prisma/client";
import { useState } from "react";
import MatchStartModal from "./MatchStartModal";

type Stats = {
  playerId: number;
  spikes: {
    count: number;
    success: number;
    mistake: number;
  };
};

export default function ScorePageClient(props: {
  homeTeamName: string;
  opponentTeamName: string;
  players: Players[];
  orderMembers: OrderMembers[];
}) {
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [opponentTeamScore, setOpponentTeamScore] = useState(0);
  const [stats, setStats] = useState<Stats[]>(
    props.players.map((player) => ({
      playerId: player.id,
      spikes: {
        count: 0,
        success: 0,
        mistake: 0,
      },
    }))
  );

  const updateStats = (
    playerId: number,
    type: "success" | "mistake" | "rally"
  ) => {
    // stats の中の playerId が一致するものを探して、スパイクのデータを更新する
    setStats((prevStats) =>
      prevStats.map((stat) =>
        stat.playerId === playerId
          ? {
              ...stat,
              spikes: {
                count: stat.spikes.count + 1,
                success:
                  type === "success"
                    ? stat.spikes.success + 1
                    : stat.spikes.success,
                mistake:
                  type === "mistake"
                    ? stat.spikes.mistake + 1
                    : stat.spikes.mistake,
              },
            }
          : stat
      )
    );
  };

  // ローテーション順に並び替える
  const sortedPlayers: Players[] = [...props.orderMembers]
    .sort((a, b) => a.rotation - b.rotation)
    .map(
      (order) =>
        props.players.find((p) => p.id === order.playerId) ?? {
          name: "player not found",
          id: 0,
          teamId: 0,
        }
    );

  // 2行3列の配置を反時計回りに調整
  const formationGrid = [
    sortedPlayers[3], // 前衛 左前 (rotation: 4)
    sortedPlayers[2], // 前衛 中央 (rotation: 3)
    sortedPlayers[1], // 前衛 右前 (rotation: 2)
    sortedPlayers[4], // 後衛 左後 (rotation: 5)
    sortedPlayers[5], // 後衛 中央 (rotation: 6)
    sortedPlayers[0], // 後衛 右後 (rotation: 1)
  ];

  console.log(stats);

  return (
    <>
      <MatchStartModal />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-lg mt-4">
          <div className="flex justify-center items-center border-4 border-gray-800 rounded-lg p-4">
            {/* ホームチーム */}
            <div className="w-1/3 text-center font-bold text-xl text-blue-600">
              <div>{props.homeTeamName}</div>
              <div className="text-3xl">{homeTeamScore}</div>
            </div>

            {/* VS */}
            <div className="text-xl font-bold text-gray-800 mx-4">VS</div>

            {/* アウェイチーム */}
            <div className="w-1/3 text-center font-bold text-xl text-red-600">
              <div>{props.opponentTeamName}</div>
              <div className="text-3xl">{opponentTeamScore}</div>
            </div>
          </div>
        </div>

        {/* サーブ権表示 */}
        <div className="flex justify-between w-full max-w-lg mt-2 px-4">
          <div className="text-sm text-green-500 font-bold">
            {true ? "サーブ権" : ""}
          </div>
          <div className="text-sm text-green-500 font-bold text-right">
            {true ? "サーブ権" : ""}
          </div>
        </div>

        {/* スコアボタン */}
        <div className="flex space-x-6">
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => setHomeTeamScore(homeTeamScore + 1)}
            >
              {props.homeTeamName} +1
            </button>
            <button
              className="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition"
              onClick={() => setHomeTeamScore(Math.max(0, homeTeamScore - 1))}
            >
              {props.homeTeamName} -1
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setOpponentTeamScore(opponentTeamScore + 1)}
            >
              {props.opponentTeamName} +1
            </button>
            <button
              className="px-4 py-2 bg-red-300 text-white rounded-lg hover:bg-red-400 transition"
              onClick={() =>
                setOpponentTeamScore(Math.max(0, opponentTeamScore - 1))
              }
            >
              {props.opponentTeamName} -1
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center mt-20 ">
          <h2 className="text-xl font-bold text-gray-800">フォーメーション</h2>
        </div>

        {/* フォーメーションボタン */}
        <div className="max-w-sm w-full mx-auto grid grid-cols-3 gap-4">
          {formationGrid.map((player, index) => (
            <AttackDialog
              key={index}
              buttonText={player.name}
              onSuccess={() => updateStats(player.id, "success")}
              onMistake={() => updateStats(player.id, "mistake")}
              onRally={() => updateStats(player.id, "rally")}
            />
          ))}
        </div>
      </div>
    </>
  );
}
