-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
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
INSERT INTO "new_Agent" ("approveBeforePosting", "brandPrimary", "brandSecondary", "brokerage", "createdAt", "creditsTotal", "creditsUsed", "email", "id", "logoLabel", "name", "niche", "passwordHash", "plan", "twinStatus") SELECT "approveBeforePosting", "brandPrimary", "brandSecondary", "brokerage", "createdAt", "creditsTotal", "creditsUsed", "email", "id", "logoLabel", "name", "niche", "passwordHash", "plan", "twinStatus" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
