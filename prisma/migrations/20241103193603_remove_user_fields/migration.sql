/*
  Warnings:

  - You are about to drop the column `sub` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sub",
DROP COLUMN "verified";
