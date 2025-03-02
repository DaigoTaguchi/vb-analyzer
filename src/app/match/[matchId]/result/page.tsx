import MatchResult from "@/app/components/MatchResult";

export default async function Result({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const matchId = parseInt((await params).matchId);
  return (
    <>
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <MatchResult matchId={matchId} />
        </div>
      </div>
    </>
  );
}
