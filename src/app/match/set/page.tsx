"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Player = {
  id: number;
  name: string;
  teamId: number;
};

type OrderMember = {
  rotation: number;
  setId: number;
  playerId: number | null;
};

export default function Set() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [orderMembers, setOrderMembers] = useState<OrderMember[]>(
    Array.from({ length: 6 }, (_, i) => ({
      rotation: i + 1, // S1 ～ S6 のローテーション番号
      setId: 1, // ここは仮の値。実際のセット ID に変更してください
      playerId: null,
    }))
  );
  const handleSubmit = () => {
    // API で選手を登録
  };

  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");

  useEffect(() => {
    // API でチームに所属している選手一覧を取得
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`/api/players?teamId=${teamId}`);
        if (!response.ok) throw new Error("Failed to fetch players");
        const data = await response.json();
        console.log(data);
        setPlayers(data.players);
      } catch (error) {
        console.error(error);
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, [teamId]);

  const handlePlayerChange = (rotation: number, playerId: number) => {
    setOrderMembers((prev) =>
      prev.map((member) =>
        member.rotation === rotation ? { ...member, playerId } : member
      )
    );
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">セット情報の登録</h2>
        <p className="text-sm text-gray-600 my-2">
          1セット目に出場する選手の情報を入力してください
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
              <option value="" disabled selected>
                S{rotation} ローテーションの選手を選択してください
              </option>
              {players.map((player) => (
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
          </div>
        ))}
      </form>
    </>
  );
}
