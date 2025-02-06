"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [homeTeam, setHomeTeam] = useState("");
  const [opponentTeam, setOpponentTeam] = useState("");
  const [players, setPlayers] = useState(Array(6).fill(""));
  const router = useRouter();

  const handleSubmit = () => {
    if (!homeTeam || !opponentTeam || players.some((name) => !name)) {
      alert("すべての項目を入力してください。");
      return;
    }

    router.push("/match");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">試合情報の入力</h1>

      <div className="mb-4">
        <label htmlFor="homeTeam" className="block font-medium mb-2">
          自チーム名
        </label>
        <input
          type="text"
          placeholder="自チーム名"
          className="border p-2 w-full mb-2"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="homeTeam" className="block font-medium mb-2">
          対戦チーム名
        </label>
        <input
          type="text"
          placeholder="対戦相手チーム名"
          className="border p-2 w-full mb-2"
          value={opponentTeam}
          onChange={(e) => setOpponentTeam(e.target.value)}
        />
      </div>

      {players.map((player, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={`player${index}`} className="block font-medium mb-2">
            選手 {index + 1} (S{index + 1})
          </label>
          <input
            id={`player${index}`}
            type="text"
            className="border p-2 w-full"
            value={player}
            onChange={(e) => {
              const newPlayers = [...players];
              newPlayers[index] = e.target.value;
              setPlayers(newPlayers);
            }}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 w-full"
      >
        次へ
      </button>
    </div>
  );
}
