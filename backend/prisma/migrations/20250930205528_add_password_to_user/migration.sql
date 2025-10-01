-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "public"."PhoneLogin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpires" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebAuthnCredential" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "credentialId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebAuthnCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhoneLogin_phoneNumber_key" ON "public"."PhoneLogin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WebAuthnCredential_credentialId_key" ON "public"."WebAuthnCredential"("credentialId");

-- AddForeignKey
ALTER TABLE "public"."PhoneLogin" ADD CONSTRAINT "PhoneLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebAuthnCredential" ADD CONSTRAINT "WebAuthnCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
