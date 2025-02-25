"use client";
import AttackDialog from "@/app/components/DIalog";
import { OrderMembers, Players } from "@prisma/client";
import { useState } from "react";

export default function ScorePageClient(props: {
  homeTeamName: string;
  opponentTeamName: string;
  players: Players[];
  orderMembers: OrderMembers[];
}) {
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [opponentTeamScore, setOpponentTeamScore] = useState(0);

  // ローテーション順に並び替える
  const sortedPlayers = props.orderMembers
    .sort((a, b) => a.rotation - b.rotation)
    .map(
      (order) =>
        props.players.find((p) => p.id === order.playerId) ?? {
          name: "player not found",
        }
    );

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-center">
          {homeTeamScore} vs {opponentTeamScore}
        </h1>

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
          {/* 前衛 */}
          <AttackDialog buttonText={sortedPlayers[3].name} />
          <AttackDialog buttonText={sortedPlayers[2].name} />
          <AttackDialog buttonText={sortedPlayers[1].name} />

          {/* 後衛 */}
          <AttackDialog buttonText={sortedPlayers[4].name} />
          <AttackDialog buttonText={sortedPlayers[5].name} />
          <AttackDialog buttonText={sortedPlayers[0].name} />
        </div>
      </div>
    </>
  );
}
