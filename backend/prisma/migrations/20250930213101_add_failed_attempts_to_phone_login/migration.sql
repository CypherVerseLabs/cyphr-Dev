-- AlterTable
ALTER TABLE "public"."PhoneLogin" ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0;
