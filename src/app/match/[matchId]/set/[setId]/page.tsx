"use client";
import { useParams } from "next/navigation";

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
export default function ScorePage() {
  const { setId } = useParams<{ setId: string }>();
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow sm:p-7">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">試合情報の入力</h2>
          <p className="text-sm text-gray-600 my-2">
            vb-analyzer に登録するチームの情報を入力してください {setId}
          </p>
        </div>
      </div>
    </div>
  );
}
