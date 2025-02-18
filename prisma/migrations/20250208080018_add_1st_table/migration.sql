-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "evented_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "home_team_name" VARCHAR(255) NOT NULL,
    "opponent_team_name" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchStats" (
    "id" SERIAL NOT NULL,
    "spikes" INTEGER NOT NULL,
    "spike_successes" INTEGER NOT NULL,
    "spike_mistakes" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,

    CONSTRAINT "MatchStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchProgress" (
    "id" SERIAL NOT NULL,
    "set_number" INTEGER NOT NULL,
    "home_team_score" INTEGER NOT NULL,
    "opponent_team_score" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,

    CONSTRAINT "MatchProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Players_team_id_key" ON "Players"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_team_id_key" ON "matches"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchStats_player_id_key" ON "MatchStats"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchStats_match_id_key" ON "MatchStats"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchProgress_match_id_key" ON "MatchProgress"("match_id");

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchStats" ADD CONSTRAINT "MatchStats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchStats" ADD CONSTRAINT "MatchStats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchProgress" ADD CONSTRAINT "MatchProgress_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
