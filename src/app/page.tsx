"use client";

import SimpleCard from "./components/SimpleCard";

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SimpleCard title="チーム登録" linkName="チーム登録へ" linkHref="/team">
        チームの登録を行います。既に登録済みの場合は不要です。登録した情報をもとに、試合データを入力し、分析することができます。
      </SimpleCard>

      <SimpleCard
        title="試合データ入力"
        linkName="試合データ入力へ"
        linkHref="/match"
      >
        実際の試合データの入力を行います。収集したデータをもとに情報を可視化して一覧で確認できます。
      </SimpleCard>
    </div>
  );
}
