"use client";

import { useState } from "react";

type Player = {
  id: string;
  name: string;
};

export default function Team() {
  const [players, setPlayers] = useState<Player[]>(
    Array(7)
      .fill("")
      .map(() => ({ id: crypto.randomUUID(), name: "" }))
  );

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = value;
    setPlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    setPlayers([...players, { id: crypto.randomUUID(), name: "" }]);
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow sm:p-7">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">チーム登録</h2>
          <p className="text-sm text-gray-600 my-2">
            vb-analyzer に登録するチームの情報を入力してください
          </p>
        </div>

        <form>
          <div className="flex flex-col gap-4 p-4 md:p-8">
            <div>
              <label
                htmlFor="teamName"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                チーム名
              </label>
              <input
                id="teamName"
                type="text"
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
                placeholder="チーム名"
              />
            </div>

            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-gray-300"></span>
              <span className="relative bg-white px-4 text-sm text-gray-400">
                選手登録
              </span>
            </div>
            <div>
              <p className="text-center text-sm text-gray-600 my-2">
                チームに登録する選手の情報を入力してください
              </p>
            </div>
            {players.map((player, index) => (
              <div key={player.id}>
                <label
                  htmlFor={`player${index + 1}`}
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  選手{index + 1}
                </label>
                <div className="flex rounded-lg">
                  <input
                    id={`player${index + 1}`}
                    type="text"
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
                    placeholder={`選手${index + 1}`}
                    value={player.name}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                  />
                  <button
                    className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-red-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      width="20"
                      height="20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.36a1 1 0 1 1 1.414 1.415L13.415 10.5l4.36 4.361a1 1 0 0 1-1.414 1.414L12 11.914l-4.361 4.36a1 1 0 0 1-1.414-1.414l4.36-4.361-4.36-4.362a1 1 0 0 1 0-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPlayer}
              className="w-24 mt-4 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200"
            >
              追加
            </button>
            <button
              type="button"
              className="w-full mt-4 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200"
            >
              チームを登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
