/*
  Warnings:

  - You are about to drop the column `set_num` on the `matches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `set_length` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "matches_team_id_key";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "set_num",
ADD COLUMN     "set_length" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "sets" (
    "id" SERIAL NOT NULL,
    "set_number" INTEGER NOT NULL,
    "home_team_score" INTEGER NOT NULL DEFAULT 0,
    "opponent_team_score" INTEGER NOT NULL DEFAULT 0,
    "is_won" BOOLEAN NOT NULL DEFAULT false,
    "match_id" INTEGER NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_members" (
    "id" SERIAL NOT NULL,
    "rotation" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "order_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sets_set_number_match_id_key" ON "sets"("set_number", "match_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_members_set_id_player_id_key" ON "order_members"("set_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_members" ADD CONSTRAINT "order_members_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_members" ADD CONSTRAINT "order_members_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
