-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'PARSING', 'PARSED', 'SUMMARIZING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentSourceType" AS ENUM ('FILE', 'URL');

-- CreateEnum
CREATE TYPE "SummaryKind" AS ENUM ('OVERVIEW', 'KEY_FACTS', 'ACTION_ITEMS');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('MARKDOWN', 'JSON');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "sourceType" "DocumentSourceType" NOT NULL,
    "mimeType" TEXT,
    "originalName" TEXT,
    "externalUrl" TEXT,
    "storageKey" TEXT,
    "pageCount" INTEGER,
    "firecrawlJobId" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentParse" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "markdown" TEXT,
    "metadataJson" JSONB,
    "tablesJson" JSONB,
    "language" TEXT,
    "parsedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentParse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSummary" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "kind" "SummaryKind" NOT NULL,
    "content" TEXT NOT NULL,
    "keyFactsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentExport" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentQAMessage" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentQAMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Document_userId_createdAt_idx" ON "Document"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentParse_documentId_key" ON "DocumentParse"("documentId");

-- CreateIndex
CREATE INDEX "DocumentSummary_documentId_kind_idx" ON "DocumentSummary"("documentId", "kind");

-- CreateIndex
CREATE INDEX "DocumentQAMessage_documentId_createdAt_idx" ON "DocumentQAMessage"("documentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentParse" ADD CONSTRAINT "DocumentParse_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSummary" ADD CONSTRAINT "DocumentSummary_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExport" ADD CONSTRAINT "DocumentExport_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentQAMessage" ADD CONSTRAINT "DocumentQAMessage_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
