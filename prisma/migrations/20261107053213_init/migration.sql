-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER');

-- CreateEnum
CREATE TYPE "Market" AS ENUM ('FUTURES', 'FOREX', 'INDIA');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TradingSession" AS ENUM ('ASIA', 'LONDON', 'NEW_YORK', 'INDIA', 'OVERLAP', 'OTHER');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PERSONAL', 'PROP');

-- CreateEnum
CREATE TYPE "ChecklistStage" AS ENUM ('PREPARATION', 'EXECUTION', 'POST_SESSION');

-- CreateEnum
CREATE TYPE "Bias" AS ENUM ('BULLISH', 'BEARISH', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ScreenshotKind" AS ENUM ('BEFORE', 'AFTER', 'CONTEXT', 'OTHER');

-- CreateEnum
CREATE TYPE "EventImpact" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "maxTradesPerDay" INTEGER NOT NULL DEFAULT 1,
    "futuresPropRiskPct" DECIMAL(5,2) NOT NULL DEFAULT 0.5,
    "forexPropRiskPct" DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    "targetRiskReward" DECIMAL(6,2) NOT NULL DEFAULT 3.0,
    "minRiskReward" DECIMAL(6,2) NOT NULL DEFAULT 3.0,
    "breakevenAfterR" DECIMAL(6,2) NOT NULL DEFAULT 2.0,
    "allowPartialExits" BOOLEAN NOT NULL DEFAULT false,
    "noRevengeTrading" BOOLEAN NOT NULL DEFAULT true,
    "noChasingMissedSetups" BOOLEAN NOT NULL DEFAULT true,
    "reviewWithinHours" INTEGER NOT NULL DEFAULT 24,
    "extraRules" JSONB NOT NULL DEFAULT '[]',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "defaultMarket" "Market" NOT NULL DEFAULT 'FUTURES',
    "publicMetricsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "bio" TEXT,
    "journeyTimeline" JSONB NOT NULL DEFAULT '[]',
    "tradingInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "riskApproach" TEXT,
    "longTermObjectives" TEXT,
    "socialLinks" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradingAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "market" "Market",
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "initialBalance" DECIMAL(14,2),
    "propFirm" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market" "Market" NOT NULL,
    "exchange" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "tickSize" DECIMAL(18,8) NOT NULL,
    "tickValue" DECIMAL(18,8) NOT NULL,
    "pointValue" DECIMAL(18,8) NOT NULL,
    "pipSize" DECIMAL(18,8),
    "lotSize" DECIMAL(18,4),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "market" "Market",
    "rules" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT,
    "instrumentId" TEXT NOT NULL,
    "setupId" TEXT,
    "market" "Market" NOT NULL,
    "direction" "Direction" NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'OPEN',
    "session" "TradingSession",
    "openedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "entryPrice" DECIMAL(18,6) NOT NULL,
    "stopLoss" DECIMAL(18,6),
    "takeProfit" DECIMAL(18,6),
    "exitPrice" DECIMAL(18,6),
    "positionSize" DECIMAL(18,6) NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "feesCommission" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "grossPnl" DECIMAL(14,4),
    "netPnl" DECIMAL(14,4),
    "plannedRisk" DECIMAL(14,4),
    "realizedR" DECIMAL(10,3),
    "thesis" TEXT,
    "executionNotes" TEXT,
    "emotionalNotes" TEXT,
    "mistakes" TEXT,
    "lessons" TEXT,
    "executionGrade" INTEGER,
    "ruleCompliant" BOOLEAN,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TradeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeScreenshot" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "kind" "ScreenshotKind" NOT NULL DEFAULT 'OTHER',
    "filePath" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradingPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "narrative" TEXT,
    "scenarios" JSONB NOT NULL DEFAULT '[]',
    "keyLevels" JSONB NOT NULL DEFAULT '[]',
    "marketFocus" "Market"[],
    "sessionFocus" "TradingSession"[],
    "readiness" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "ChecklistStage" NOT NULL,
    "items" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checked" JSONB NOT NULL DEFAULT '[]',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "summary" TEXT,
    "executionGrade" INTEGER,
    "adherenceScore" DECIMAL(5,2),
    "mistakes" TEXT,
    "lessons" TEXT,
    "emotionalReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "tradesTaken" INTEGER NOT NULL DEFAULT 0,
    "tradesAvoided" INTEGER NOT NULL DEFAULT 0,
    "ruleViolations" INTEGER NOT NULL DEFAULT 0,
    "executionGrade" INTEGER,
    "strongestSetup" TEXT,
    "recurringMistakes" TEXT,
    "improvementPriorities" TEXT,
    "nextWeekPlan" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "market" "Market",
    "instruments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readingTime" INTEGER,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "tradeId" TEXT,
    "market" "Market" NOT NULL,
    "instrument" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "session" "TradingSession",
    "setup" TEXT,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "rrPlanned" DECIMAL(8,2),
    "rrActual" DECIMAL(8,2),
    "grade" INTEGER,
    "chartImage" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "market" "Market",
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "notes" TEXT,
    "bias" "Bias" NOT NULL DEFAULT 'NEUTRAL',
    "keyLevels" JSONB NOT NULL DEFAULT '[]',
    "setupStatus" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "market" "Market",
    "content" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "currency" TEXT,
    "impact" "EventImpact" NOT NULL DEFAULT 'MEDIUM',
    "eventAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EconomicEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TradeToTradeTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TradeToTradeTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_symbol_key" ON "Instrument"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Setup_userId_name_key" ON "Setup"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_publicSlug_key" ON "Trade"("publicSlug");

-- CreateIndex
CREATE INDEX "Trade_userId_openedAt_idx" ON "Trade"("userId", "openedAt");

-- CreateIndex
CREATE INDEX "Trade_userId_market_idx" ON "Trade"("userId", "market");

-- CreateIndex
CREATE UNIQUE INDEX "TradeTag_name_key" ON "TradeTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TradingPlan_userId_date_key" ON "TradingPlan"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistEntry_templateId_date_key" ON "ChecklistEntry"("templateId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReview_userId_date_key" ON "DailyReview"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReview_userId_weekStart_key" ON "WeeklyReview"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchArticle_slug_key" ON "ResearchArticle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_tradeId_key" ON "CaseStudy"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookItem_slug_key" ON "PlaybookItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_instrumentId_key" ON "WatchlistItem"("userId", "instrumentId");

-- CreateIndex
CREATE INDEX "_TradeToTradeTag_B_index" ON "_TradeToTradeTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradingAccount" ADD CONSTRAINT "TradingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setup" ADD CONSTRAINT "Setup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_setupId_fkey" FOREIGN KEY ("setupId") REFERENCES "Setup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeScreenshot" ADD CONSTRAINT "TradeScreenshot_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradingPlan" ADD CONSTRAINT "TradingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTemplate" ADD CONSTRAINT "ChecklistTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistEntry" ADD CONSTRAINT "ChecklistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistEntry" ADD CONSTRAINT "ChecklistEntry_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecklistTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReview" ADD CONSTRAINT "DailyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReview" ADD CONSTRAINT "WeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketNote" ADD CONSTRAINT "MarketNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicEvent" ADD CONSTRAINT "EconomicEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TradeToTradeTag" ADD CONSTRAINT "_TradeToTradeTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TradeToTradeTag" ADD CONSTRAINT "_TradeToTradeTag_B_fkey" FOREIGN KEY ("B") REFERENCES "TradeTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
