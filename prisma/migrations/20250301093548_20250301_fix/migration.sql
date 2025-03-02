/*
  Warnings:

  - You are about to drop the column `home_team_name` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the `MatchProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchProgress" DROP CONSTRAINT "MatchProgress_match_id_fkey";

-- DropForeignKey
ALTER TABLE "MatchStats" DROP CONSTRAINT "MatchStats_match_id_fkey";

-- DropForeignKey
ALTER TABLE "MatchStats" DROP CONSTRAINT "MatchStats_player_id_fkey";

-- DropIndex
DROP INDEX "sets_set_number_match_id_key";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "home_team_name";

-- DropTable
DROP TABLE "MatchProgress";

-- DropTable
DROP TABLE "MatchStats";

-- CreateTable
CREATE TABLE "match_stats" (
    "id" SERIAL NOT NULL,
    "spikes" INTEGER NOT NULL,
    "spike_successes" INTEGER NOT NULL,
    "spike_mistakes" INTEGER NOT NULL,
    "order_member_id" INTEGER NOT NULL,

    CONSTRAINT "match_stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_order_member_id_fkey" FOREIGN KEY ("order_member_id") REFERENCES "order_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
