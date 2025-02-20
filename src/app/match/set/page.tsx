"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Set() {
  const [players, setPlayers] = useState([]);
  // const handleSubmit = () => {
  //   // API で選手を登録
  // };

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
        setPlayers(data.players); // ここでエラー
      } catch (error) {
        console.error(error);
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, [teamId]);

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">セット情報の登録</h2>
        <p className="text-sm text-gray-600 my-2">
          1セット目に出場する選手の情報を入力してください
        </p>
      </div>
      {players}
      {/* <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <div>
            <label
              htmlFor="title"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              試合のタイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
              placeholder="title"
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>
        </div>
      </form> */}
    </>
  );
}
