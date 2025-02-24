import { prisma } from "@/lib/prisma";
import ScorePageClient from "./component/ScorePageClient";

// /match/[matchId]/set/[setId] ページの親ページ
// サーバーコンポーネントとして実装

// ページを開いたときにサーバーから試合の情報を取得する
// 表示する項目は以下
//
// ・自チーム名と対戦相手チーム名
// ・それぞれの得点現在の得点
// ・ローテーション
// ・得点を加算するボタン
// ・セット終了ボタン
//
// ローテーションの部分は選手名のボタンとする
// 選手のボタンを押すと、スパイクの決定、ミス、つなぎの3つの項目を選択できる
//
// 各種データはローカルストレージに保存しておいて、セット終了時にまとめてサーバーに API で送る方がいい
// ブラウザ更新時に復元できてほしい
export default async function ScorePage({
  params,
}: {
  params: Promise<{ matchId: string; setId: string }>;
}) {
  const matchId = parseInt((await params).matchId);
  const setId = parseInt((await params).setId);

  const match = await prisma.matches.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    return <div>試合タイトルが見つかりません</div>;
  }

  const { homeTeamName, opponentTeamName, teamId } = match;

  const players = await prisma.players.findMany({
    where: { teamId },
  });

  if (!teamId) {
    return <div>選手情報の一覧取得に失敗しました</div>;
  }

  const set = await prisma.sets.findFirst({
    where: {
      id: setId,
    },
  });

  if (!set) {
    return <div>セット情報の取得に失敗しました</div>;
  }

  const orderMembers = await prisma.orderMembers.findMany({
    where: { setId },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow sm:p-7">
        <h1 className="text-3xl font-bold text-center">
          {homeTeamName} vs {opponentTeamName}
        </h1>
        <ScorePageClient
          players={players}
          set={set}
          match={match}
          orderMembers={orderMembers}
        />
      </div>
    </div>
  );
}
