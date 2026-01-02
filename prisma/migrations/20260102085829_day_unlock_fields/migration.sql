-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "openedById" TEXT,
    "closedById" TEXT,
    "closedLockReason" TEXT,
    "ownerUnlockRequired" BOOLEAN NOT NULL DEFAULT false,
    "unlockRequestReason" TEXT,
    "unlockRequestedById" TEXT,
    "unlockWindowUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayRecord_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DayRecord_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DayRecord_unlockRequestedById_fkey" FOREIGN KEY ("unlockRequestedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DayRecord" ("closedAt", "closedById", "closedLockReason", "createdAt", "date", "id", "openedAt", "openedById", "ownerUnlockRequired", "status", "updatedAt") SELECT "closedAt", "closedById", "closedLockReason", "createdAt", "date", "id", "openedAt", "openedById", "ownerUnlockRequired", "status", "updatedAt" FROM "DayRecord";
DROP TABLE "DayRecord";
ALTER TABLE "new_DayRecord" RENAME TO "DayRecord";
CREATE UNIQUE INDEX "DayRecord_date_key" ON "DayRecord"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
