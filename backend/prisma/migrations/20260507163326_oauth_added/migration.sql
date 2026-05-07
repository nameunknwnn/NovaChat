-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "AuthType" "AuthType" DEFAULT 'GOOGLE',
ADD COLUMN     "authId" TEXT;
