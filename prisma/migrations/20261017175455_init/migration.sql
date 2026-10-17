-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brokerage" TEXT NOT NULL,
    "niche" TEXT NOT NULL DEFAULT 'New builds',
    "plan" TEXT NOT NULL DEFAULT 'Growth',
    "creditsTotal" INTEGER NOT NULL DEFAULT 20,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "approveBeforePosting" BOOLEAN NOT NULL DEFAULT true,
    "twinStatus" TEXT NOT NULL DEFAULT 'none',
    "brandPrimary" TEXT NOT NULL DEFAULT '#2F6BFF',
    "brandSecondary" TEXT NOT NULL DEFAULT '#1B5FAD',
    "logoLabel" TEXT NOT NULL DEFAULT 'PE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SocialAccount_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "typeLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "caption" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "thumb" TEXT NOT NULL,
    "scheduledFor" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentItem_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyScript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "weekOf" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyScript_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
