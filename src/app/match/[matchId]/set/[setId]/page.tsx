"use client";
import { useParams } from "next/navigation";

export default function ScorePage() {
  const { setId } = useParams<{ setId: string }>();
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-gray-800">試合情報の入力</h2>
      <p className="text-sm text-gray-600 my-2">
        vb-analyzer に登録するチームの情報を入力してください {setId}
      </p>
    </div>
  );
}
