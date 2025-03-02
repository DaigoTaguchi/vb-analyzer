"use client";
import { Teams } from "@prisma/client";
import { useEffect, useState } from "react";

export default function TeamSearchBox(props: {
  teams: Teams[];
  label: string;
  selectedHandler: (team: Teams) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<Teams[]>([]);

  useEffect(() => {
    // 検索に基づいてフィルタリング
    setFilteredTeams(
      props.teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, props.teams]);

  return (
    <>
      <label
        htmlFor="homeTeamName"
        className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
      >
        {props.label}
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
                    props.selectedHandler(team);
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
    </>
  );
}
