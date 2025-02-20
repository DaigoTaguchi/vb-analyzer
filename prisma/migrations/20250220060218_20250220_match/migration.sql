/*
  Warnings:

  - Added the required column `set_num` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "set_num" INTEGER NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
