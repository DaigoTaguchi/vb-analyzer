"use client";
import AttackDialog from "@/app/components/DIalog";
import { SimpleButton } from "@/app/components/SimpleButton";
import { OrderMembers, Players } from "@prisma/client";
import { useState } from "react";

type Stats = {
  playerId: number;
  playerName: string;
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
      playerName: player.name,
      spikes: {
        count: 0,
        success: 0,
        mistake: 0,
      },
    }))
  );

  const initialFormation = props.orderMembers
    .map((order) => ({
      rotation: order.rotation,
      player: props.players.find((p) => p.id === order.playerId) ?? {
        id: 0,
        name: "player not found",
        teamId: 0,
      },
    }))
    .sort((a, b) => a.rotation - b.rotation);

  const [formationGrid, setFormationGrid] = useState(initialFormation);

  const handleRotate = () => {
    setFormationGrid((prev) =>
      prev
        .map(({ rotation, player }) => ({
          player,
          rotation: rotation === 1 ? 6 : rotation - 1,
        }))
        .sort((a, b) => a.rotation - b.rotation)
    );
  };

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

  console.log(stats);

  return (
    <>
      <div className="flex flex-col items-center space-y-20">
        {/*スコア表示部分*/}
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

          {/* スコアボタン */}
          <div className="flex space-x-6">
            {/*自チームスコア追加ボタン*/}
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

            {/*相手チームスコア追加ボタン*/}
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

        {/*フォーメーション表示部分*/}
        <div className="w-full max-w-lg flex flex-col items-center space-y-8">
          <div className="w-full max-w-lg py-3 flex items-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
            フォーメーション
          </div>
          {/* <h2 className="text-xl font-bold text-gray-800">フォーメーション</h2> */}
          {/* フォーメーションボタン */}
          <div className="max-w-sm w-full mx-auto grid grid-cols-3 gap-4">
            {[
              formationGrid[3], // 前衛 左前 (rotation: 4)
              formationGrid[2], // 前衛 中央 (rotation: 3)
              formationGrid[1], // 前衛 右前 (rotation: 2)
              formationGrid[4], // 後衛 左後 (rotation: 5)
              formationGrid[5], // 後衛 中央 (rotation: 6)
              formationGrid[0], // 後衛 右後 (rotation: 1)
            ].map(({ player }, index) => (
              <AttackDialog
                key={index}
                buttonText={player.name}
                onSuccess={() => updateStats(player.id, "success")}
                onMistake={() => updateStats(player.id, "mistake")}
                onRally={() => updateStats(player.id, "rally")}
              />
            ))}
          </div>
          {/* ローテーションボタン */}
          <button
            type="button"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleRotate}
          >
            ⟳
          </button>
        </div>

        <div className="w-full max-w-lg flex flex-col items-center space-y-3 border">
          {stats.map((stat) => (
            <p
              key={stat.playerId}
              className="bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-500 text-transparent"
            >
              {stat.playerName} アタック成功率 :{" "}
              {stat.spikes.count === 0
                ? 0
                : (stat.spikes.success / stat.spikes.count) * 100}{" "}
              % ({stat.spikes.success} / {stat.spikes.count} 本)
            </p>
          ))}
          <p className="bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-500 text-transparent">
            {}
          </p>
        </div>
        <SimpleButton width="large">セットを終了</SimpleButton>
      </div>
    </>
  );
}
