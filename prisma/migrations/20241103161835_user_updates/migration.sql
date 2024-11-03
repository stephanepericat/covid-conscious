-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sub" TEXT,
ADD COLUMN     "verified" BOOLEAN DEFAULT false;
