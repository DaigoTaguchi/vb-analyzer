/*
  Warnings:

  - You are about to drop the `match_stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "match_stats" DROP CONSTRAINT "match_stats_order_member_id_fkey";

-- DropTable
DROP TABLE "match_stats";

-- CreateTable
CREATE TABLE "spike_stats" (
    "id" SERIAL NOT NULL,
    "spikes" INTEGER NOT NULL,
    "spike_successes" INTEGER NOT NULL,
    "spike_mistakes" INTEGER NOT NULL,
    "order_member_id" INTEGER NOT NULL,

    CONSTRAINT "spike_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spike_stats_order_member_id_key" ON "spike_stats"("order_member_id");

-- AddForeignKey
ALTER TABLE "spike_stats" ADD CONSTRAINT "spike_stats_order_member_id_fkey" FOREIGN KEY ("order_member_id") REFERENCES "order_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
