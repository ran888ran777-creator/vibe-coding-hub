-- CreateEnum
CREATE TYPE "DocumentJobType" AS ENUM ('PARSE', 'SUMMARY');

-- CreateEnum
CREATE TYPE "DocumentJobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "DocumentJob" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "type" "DocumentJobType" NOT NULL,
    "status" "DocumentJobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "payloadJson" JSONB,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentJob_documentId_createdAt_idx" ON "DocumentJob"("documentId", "createdAt");

-- CreateIndex
CREATE INDEX "DocumentJob_status_createdAt_idx" ON "DocumentJob"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "DocumentJob" ADD CONSTRAINT "DocumentJob_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
