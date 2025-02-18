/*
  Warnings:

  - You are about to drop the `Players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchStats" DROP CONSTRAINT "MatchStats_player_id_fkey";

-- DropForeignKey
ALTER TABLE "Players" DROP CONSTRAINT "Players_team_id_fkey";

-- DropTable
DROP TABLE "Players";

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_team_id_key" ON "players"("team_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchStats" ADD CONSTRAINT "MatchStats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
