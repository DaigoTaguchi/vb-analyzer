"use client";
import AttackDialog from "@/app/components/DIalog";
import { SimpleButton } from "@/app/components/SimpleButton";
import { OrderMembers, Players } from "@prisma/client";
import { useRouter } from "next/navigation";
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

// TODO: スパイクデータを入力するたびに、stats をローカルストレージに保管して
// ブラウザを reload してもデータを保持できるようにしたい
export default function ScorePageClient(props: {
  matchId: number;
  setId: number;
  teamId: number;
  setNumber: number;
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
  const [errors, setErrors] = useState<{
    apiError?: string;
  }>({});

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

  const router = useRouter();

  const handleFinishSet = async () => {
    const body = {
      set: {
        id: props.setId,
        homeTeamScore,
        opponentTeamScore,
        isWon: homeTeamScore > opponentTeamScore,
      },
      stats: stats.map((stat) => ({
        spikes: stat.spikes.count,
        spikeSuccesses: stat.spikes.success,
        spikeMistakes: stat.spikes.mistake,
        orderMemberId: props.orderMembers.find(
          (order) => order.playerId === stat.playerId
        )?.id,
      })),
    };

    // セットの結果をサーバーに送る
    // サーバー側で試合が終了したかどうかを判定して、response に送る

    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors((prev) => ({
          ...prev,
          apiError: data.message || "stats の登録に失敗しました",
        }));
        return;
      }

      const data = await response.json();
      console.log(data);
      if (data.isFinish) {
        // TODO: 試合が終了したら試合の結果画面に移動させる
        return router.push("/");
      }
      // 試合がまだ終了してなければ、再度次のセット情報入力画面に遷移
      return router.push(
        `/match/${props.matchId}/set?teamId=${props.teamId}&setNumber=${
          props.setNumber + 1
        }`
      );
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        apiError: error instanceof Error ? error.message : String(error),
      }));
    }
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

  return (
    <>
      <div className="flex flex-col items-center space-y-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {props.setNumber}セット目のデータ入力
          </h2>
          <p className="text-sm text-gray-600 my-2">
            {props.setNumber}セット目のデータを入力してください
          </p>
        </div>
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
        {errors.apiError && (
          <div
            className="w-full max-w-lg bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30"
            role="alert"
            tabIndex={-1}
            aria-labelledby="hs-bordered-red-style-label"
          >
            <div className="flex">
              <div className="shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3">
                <h3
                  id="hs-bordered-red-style-label"
                  className="text-gray-800 font-semibold dark:text-white"
                >
                  Error!
                </h3>
                <p className="text-sm text-gray-700 dark:text-neutral-400">
                  {errors.apiError}
                </p>
              </div>
            </div>
          </div>
        )}
        <SimpleButton width="large" onClick={handleFinishSet}>
          セットを終了
        </SimpleButton>
      </div>
    </>
  );
}
