import { prisma } from "@/lib/prisma";
import SetPageClient from "./component/SetPageClient";

export default async function Set({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ teamId: string; setNumber: string }>;
}) {
  const matchId = parseInt((await params).matchId);
  const teamId = parseInt((await searchParams).teamId);
  const setNumber = parseInt((await searchParams).setNumber);

  const players = await prisma.players.findMany({
    where: {
      teamId,
    },
  });

  if (!players) {
    return <div>選手情報の取得に失敗しました</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow sm:p-7">
        <SetPageClient
          matchId={matchId}
          setNumber={setNumber}
          players={players}
        />
      </div>
    </div>
  );
}
