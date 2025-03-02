"use client";

import { Matches, Teams } from "@prisma/client";
import TeamSearchBox from "../components/TeamSearchBox";
import { useEffect, useState } from "react";
import { SelectMenu } from "../components/SelectMenu";
import MatchResult from "../components/MatchResult";

export default function DataClientPage(props: { teams: Teams[] }) {
  const [team, setTeam] = useState<Teams>({ id: 0, name: "" });
  const [matches, setMatches] = useState<Matches[]>([]);
  const [match, setMatch] = useState<Matches | null>(null);

  useEffect(() => {
    // 選択された team が変化するたびに試合一覧を DB から取得する
    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/matches/${team.id}`);
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error(error);
        setMatches([]);
      }
    };
    fetchMatches();
  }, [team]);

  const handleMatchChange = (selectedId: string) => {
    const selectedMatch =
      matches.find((m) => m.id.toString() === selectedId) || null;
    setMatch(selectedMatch);
  };

  return (
    <>
      <div className="w-full max-w-xs">
        <TeamSearchBox
          teams={props.teams}
          label="チーム名"
          selectedHandler={setTeam}
        />
      </div>
      <div className="w-full max-w-xs">
        <SelectMenu
          options={matches.map((match) => ({
            value: match.id.toString(),
            label: match.title,
          }))}
          label="試合名"
          initOption={match ? match.id.toString() : ""}
          onChange={handleMatchChange}
        />
      </div>
      {match && (
        <>
          <hr className="w-full border-1" />
          <MatchResult matchId={match.id} />
        </>
      )}
    </>
  );
}
