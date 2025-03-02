import { prisma } from "@/lib/prisma";
import DataClientPage from "./DataClientPage";

export default async function Data() {
  const teams = await prisma.teams.findMany();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col items-center space-y-5">
          <h1 className="text-2xl font-bold text-center mb-4">
            試合データの閲覧
          </h1>
          <DataClientPage teams={teams} />
        </div>
      </div>
    </div>
  );
}
