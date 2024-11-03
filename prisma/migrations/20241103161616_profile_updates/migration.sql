/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "name" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";
