"use client";

import { SimpleButton } from "@/app/components/SimpleButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Player = {
  id: number;
  name: string;
  teamId: number;
};

type OrderMember = {
  rotation: number;
  playerId: number | null;
};

export default function SetPageClient(props: {
  matchId: number;
  setNumber: number;
  players: Player[];
}) {
  const [orderMembers, setOrderMembers] = useState<OrderMember[]>(
    Array.from({ length: 6 }, (_, i) => ({
      rotation: i + 1, // S1 ～ S6 のローテーション番号
      playerId: null,
    }))
  );
  const [errors, setErrors] = useState<{
    apiError?: string;
    orderMembers?: { [key: number]: string };
  }>({});

  const router = useRouter();

  const handlePlayerChange = (rotation: number, playerId: number) => {
    setOrderMembers((prev) =>
      prev.map((member) =>
        member.rotation === rotation ? { ...member, playerId } : member
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // API で選手を登録
    e.preventDefault();

    // 未選択の選手がいる場合はエラーを出す
    const missingSelections: { [key: number]: string } = {};
    orderMembers.forEach(({ playerId, rotation }) => {
      if (playerId === null) {
        missingSelections[rotation] = `S${rotation} の選手を選択してください`;
      }
    });

    if (Object.keys(missingSelections).length > 0) {
      setErrors({ orderMembers: missingSelections });
      return;
    }

    const response = await fetch("/api/match/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matchId: props.matchId,
        setNumber: props.setNumber,
        homeTeamScore: 0,
        opponentTeamScore: 0,
        orderMembers,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors((prev) => ({
        ...prev,
        apiError: data.message || "セット情報の登録に失敗しました",
      }));
      return;
    }

    const data = await response.json();
    console.log("登録成功");

    router.push(`/match/${props.matchId}/set/${data.setId}`);
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">セット情報の登録</h2>
        <p className="text-sm text-gray-600 my-2">
          セットの情報を入力してください
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 md:p-8">
        {orderMembers.map(({ rotation, playerId }) => (
          <div key={rotation} className="relative">
            <select
              className="peer p-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
              value={playerId ?? ""}
              onChange={(e) =>
                handlePlayerChange(rotation, Number(e.target.value))
              }
            >
              <option value="">
                S{rotation} ローテーションの選手を選択してください
              </option>
              {props.players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <label
              className="absolute top-0 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
      peer-focus:text-xs
      peer-focus:-translate-y-1.5
      peer-focus:text-gray-500
      peer-[:not(:placeholder-shown)]:text-xs
      peer-[:not(:placeholder-shown)]:-translate-y-1.5
      peer-[:not(:placeholder-shown)]:text-gray-500"
            >
              S{rotation}
            </label>
            {errors.orderMembers?.[rotation] && (
              <p className="text-red-600 text-sm mt-1">
                {errors.orderMembers[rotation]}
              </p>
            )}
          </div>
        ))}

        {errors.apiError && (
          <div
            className="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30"
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
        <div className="flex justify-center">
          <SimpleButton width="large" type="submit">
            セット情報を登録
          </SimpleButton>
        </div>
      </form>
    </>
  );
}
