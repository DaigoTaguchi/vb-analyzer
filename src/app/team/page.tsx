"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { SimpleButton } from "../components/SimpleButton";
import { PlusButton } from "../components/PlusButton";

type Player = {
  id: string;
  name: string;
};

const TeamSchema = z.object({
  teamName: z
    .string()
    .min(1, "チーム名を入力してください")
    .max(100, "100文字以内で入力してください"),
  players: z
    .array(z.string().min(1, "選手名を入力してください"))
    .max(20, "選手は一度に20人まで登録できます"),
});

export default function Team() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<Player[]>(
    Array(1)
      .fill("")
      .map(() => ({ id: crypto.randomUUID(), name: "" }))
  );
  const [errors, setErrors] = useState<{
    teamName?: string;
    players?: string[];
    apiError?: string;
  }>({});

  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = TeamSchema.safeParse({
      teamName,
      players: players.map((p) => p.name),
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        teamName: fieldErrors.teamName?.[0],
        players: fieldErrors.players,
      });
      return;
    }

    const response = await fetch("/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName, players: players.map((p) => p.name) }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors((prev) => ({
        ...prev,
        apiError: data.message || "登録に失敗しました",
      }));
      return;
    }

    router.push("/team/thanks");
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">チーム登録</h2>
        <p className="text-sm text-gray-600 my-2">
          vb-analyzer に登録するチームの情報を入力してください
        </p>
      </div>
      <form onSubmit={handleSubmit}>
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
              value={teamName}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
              placeholder="チーム名"
              onChange={(e) => setTeamName(e.target.value)}
            />
            {errors.teamName && (
              <p className="text-red-600 text-sm mt-1">{errors.teamName}</p>
            )}
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
                  className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
              {errors.players?.[index] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.players[index]}
                </p>
              )}
            </div>
          ))}
          <PlusButton handler={handleAddPlayer} />

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
              チームを登録
            </SimpleButton>
          </div>
        </div>
      </form>
    </>
  );
}
