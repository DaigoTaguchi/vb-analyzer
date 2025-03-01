import StatsCard from "@/app/components/StatsCard";
import { prisma } from "@/lib/prisma";

export default async function Result({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const matchId = parseInt((await params).matchId);

  const sets = await prisma.sets.findMany({
    where: { matchId },
    include: {
      matches: {
        include: {
          teams: true,
        },
      },
      orderMembers: {
        include: {
          players: true,
          spikeStats: true,
        },
      },
    },
  });

  if (sets.length === 0) {
    return <div>セット情報の取得に失敗しました</div>;
  }

  const { title, opponentTeamName } = sets[0].matches;
  const teamName = sets[0].matches.teams.name;

  // スパイクの総数
  let spikeCount = 0;
  sets.forEach((set) =>
    set.orderMembers.forEach(
      (order) => (spikeCount += order.spikeStats?.spikes ?? 0)
    )
  );

  // スパイクミスの総数
  let spikeMissCount = 0;
  sets.forEach((set) =>
    set.orderMembers.forEach(
      (order) => (spikeMissCount += order.spikeStats?.spikeMistakes ?? 0)
    )
  );

  // スパイクミスの総数
  let spikeSuccessCount = 0;
  sets.forEach((set) =>
    set.orderMembers.forEach(
      (order) => (spikeSuccessCount += order.spikeStats?.spikeSuccesses ?? 0)
    )
  );

  // 選手ごとのスパイクの結果
  const result = await getSpikeCountsByMatch(matchId);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* カードデザイン */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col items-center space-y-5">
          <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
          <div className="text-center text-2xl font-semibold mb-4">
            {teamName} <span className="text-gray-500">VS</span>{" "}
            {opponentTeamName}
          </div>

          {/* テーブルデザイン */}
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border border-gray-300 text-center">
                    Win
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    {teamName}
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    セット
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    {opponentTeamName}
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Win
                  </th>
                </tr>
              </thead>
              <tbody>
                {sets.map((set, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300 text-center font-bold">
                      {set.homeTeamScore > set.opponentTeamScore ? "◯" : ""}
                    </td>
                    <td className="p-2 border border-gray-300 text-center font-bold">
                      {set.homeTeamScore}
                    </td>
                    <td className="p-2 border border-gray-300 text-center">
                      {index + 1}
                    </td>
                    <td className="p-2 border border-gray-300 text-center font-bold">
                      {set.opponentTeamScore}
                    </td>
                    <td className="p-2 border border-gray-300 text-center font-bold">
                      {set.opponentTeamScore > set.homeTeamScore ? "◯" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full grid grid-cols-3 gap-4">
            <StatsCard title="spike-count">{spikeCount}</StatsCard>
            <StatsCard title="spike-miss-count">{spikeMissCount}</StatsCard>
            <StatsCard title="spike-success-count">
              {spikeSuccessCount}
            </StatsCard>
            <StatsCard title="spike-efficiency">
              {((spikeSuccessCount / spikeCount) * 100).toFixed(2)} %
            </StatsCard>
          </div>

          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Success
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                      >
                        Miss
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                      >
                        Efficiency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.map((r) => (
                      <tr key={r.playerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                          {r.playerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                          {r.totalSpikes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                          {r.totalSuccessSpikes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          {r.totalMissSpikes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          {(
                            (r.totalSuccessSpikes / r.totalSpikes) *
                            100
                          ).toFixed(2)}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getSpikeCountsByMatch(matchId: number) {
  const results = await prisma.players.findMany({
    where: {
      orderMembers: {
        some: {
          sets: {
            matchId: matchId,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      orderMembers: {
        select: {
          spikeStats: {
            select: {
              spikes: true,
              spikeSuccesses: true,
              spikeMistakes: true,
            },
          },
        },
      },
    },
  });

  // 選手ごとのスパイク総数を集計
  return results.map((player) => ({
    playerId: player.id,
    playerName: player.name,
    totalSpikes: player.orderMembers.reduce(
      (sum, order) => sum + (order.spikeStats?.spikes ?? 0),
      0
    ),
    totalSuccessSpikes: player.orderMembers.reduce(
      (sum, order) => sum + (order.spikeStats?.spikeSuccesses ?? 0),
      0
    ),
    totalMissSpikes: player.orderMembers.reduce(
      (sum, order) => sum + (order.spikeStats?.spikeMistakes ?? 0),
      0
    ),
  }));
}
