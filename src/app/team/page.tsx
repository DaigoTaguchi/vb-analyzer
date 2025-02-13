"use client";

import { useState } from "react";

export default function Team() {
  const [players, setPlayers] = useState(Array(7).fill(""));

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const deletePlayer = () => {
    const playerList = [...players];
    playerList.pop();
    setPlayers(playerList);
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
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
            {players.map((_, index) => (
              <div key={index}>
                <label
                  htmlFor={`player${index + 1}`}
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  選手{index + 1}
                </label>
                <input
                  id={`player${index + 1}`}
                  type="text"
                  className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                  placeholder={`選手${index + 1}`}
                  value={players[index]}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={addPlayer}
                className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                選手を追加
              </button>
              <button
                type="button"
                onClick={deletePlayer}
                className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                選手を削除
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
