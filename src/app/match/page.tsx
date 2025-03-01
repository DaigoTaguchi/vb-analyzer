"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { SelectMenu } from "../components/SelectMenu";
import { SimpleButton } from "../components/SimpleButton";
import { useRouter } from "next/navigation";

type Team = {
  id: number;
  name: string;
};

const MatchSchema = z.object({
  title: z
    .string()
    .min(1, "試合のタイトルを入力してください")
    .max(100, "100文字以内で入力してください"),
  homeTeam: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .refine((val) => val !== null, "自チーム名を選択してください"),
  opponentTeamName: z
    .string()
    .min(1, "対戦相手チーム名を入力してください")
    .max(100, "100文字以内で入力してください"),
});

export default function Match() {
  const [title, setTitle] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [opponentTeamName, setOpponentTeamName] = useState("");
  const [setLength, setSetLength] = useState("3");
  const [errors, setErrors] = useState<{
    title?: string;
    homeTeam?: string;
    opponentTeamName?: string;
    setNum?: string;
    apiError?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    // API からチーム一覧を取得
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        console.log(data);
        setTeams(data.teams);
        setFilteredTeams(data.teams); // 初期状態ではすべて表示
      } catch (error) {
        console.error(error);
        setTeams([]);
        setFilteredTeams([]);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    // 検索に基づいてフィルタリング
    setFilteredTeams(
      teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, teams]);

  const handleSubmit = async (e: React.FormEvent) => {
    // submit 時の動作を定義
    e.preventDefault();

    const validationResult = MatchSchema.safeParse({
      title,
      homeTeam,
      opponentTeamName,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        homeTeam: fieldErrors.homeTeam?.[0],
        opponentTeamName: fieldErrors.opponentTeamName?.[0],
      });
      return;
    }

    if (!homeTeam) {
      return;
    }
    // API で Match テーブルに登録
    const response = await fetch("/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        teamId: homeTeam.id || opponentTeamName,
        opponentTeamName,
        setLength: parseInt(setLength),
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors((prev) => ({
        ...prev,
        apiError: data.message || "登録に失敗しました",
      }));
      return;
    }

    const data = await response.json();
    const matchId = data.matchId;

    router.push(`/match/${matchId}/set?teamId=${homeTeam.id}&setNumber=1`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow sm:p-7">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">試合登録</h2>
          <p className="text-sm text-gray-600 my-2">
            vb-analyzer に登録する試合の情報を入力してください
          </p>
        </div>
        <form onSubmit={handleSubmit}>
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
            <div>
              <label
                htmlFor="homeTeamName"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                自チーム名
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
                    type="text"
                    role="combobox"
                    aria-controls="team-list"
                    aria-expanded={isOpen}
                    value={search}
                    placeholder="チーム名を検索"
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                  />
                  <div
                    className="absolute top-1/2 end-3 -translate-y-1/2 cursor-pointer"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <svg
                      className="shrink-0 size-3.5 text-gray-500"
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
                      <path d="m7 15 5 5 5-5"></path>
                      <path d="m7 9 5-5 5 5"></path>
                    </svg>
                  </div>
                </div>
                {isOpen && (
                  <div
                    id="team-list"
                    role="listbox"
                    className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    style={{ display: isOpen ? "block" : "none" }}
                  >
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => (
                        <div
                          key={team.id}
                          className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg"
                          onClick={() => {
                            setSearch(team.name);
                            setIsOpen(false);
                            setHomeTeam(team);
                          }}
                        >
                          {team.name}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-4 text-sm text-gray-500">
                        No teams found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.homeTeam && (
                <p className="text-red-600 text-sm mt-1">{errors.homeTeam}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="opponentTeamName"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                対戦相手チーム名
              </label>
              <input
                id="opponentTeamName"
                type="text"
                value={opponentTeamName}
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
                placeholder="対戦相手チーム名"
                onChange={(e) => setOpponentTeamName(e.target.value)}
              />
              {errors.opponentTeamName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.opponentTeamName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="setLength"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                セット数
              </label>
              <SelectMenu
                options={["1", "2", "3", "4", "5"]}
                initOption={setLength}
                onChange={setSetLength}
              />
            </div>
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
            <SimpleButton width="medium" type="submit">
              入力完了
            </SimpleButton>
          </div>
        </form>
      </div>
    </div>
  );
}
