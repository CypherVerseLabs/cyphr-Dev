-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "walletType" TEXT NOT NULL,
    "label" TEXT,
    "chainId" INTEGER,
    "metadata" JSONB,
    "ensName" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiKey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "allowedDomains" TEXT NOT NULL,
    "bundleIds" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiKeyServices" (
    "id" SERIAL NOT NULL,
    "apiKeyId" INTEGER NOT NULL,
    "sdk" BOOLEAN NOT NULL DEFAULT true,
    "rpc" BOOLEAN NOT NULL DEFAULT false,
    "ipfsUpload" BOOLEAN NOT NULL DEFAULT false,
    "ipfsDownload" BOOLEAN NOT NULL DEFAULT false,
    "bundler" BOOLEAN NOT NULL DEFAULT false,
    "paymaster" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApiKeyServices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "public"."Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_clientId_key" ON "public"."ApiKey"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeyServices_apiKeyId_key" ON "public"."ApiKeyServices"("apiKeyId");

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKeyServices" ADD CONSTRAINT "ApiKeyServices_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
