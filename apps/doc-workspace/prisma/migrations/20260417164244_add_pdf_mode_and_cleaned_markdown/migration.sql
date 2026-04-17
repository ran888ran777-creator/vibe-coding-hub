-- CreateEnum
CREATE TYPE "PdfParseMode" AS ENUM ('AUTO', 'OCR', 'FAST');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "pdfParseMode" "PdfParseMode" NOT NULL DEFAULT 'AUTO';

-- AlterTable
ALTER TABLE "DocumentParse" ADD COLUMN     "cleanedMarkdown" TEXT;
