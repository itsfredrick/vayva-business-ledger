-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DriverDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "driverProfileId" TEXT NOT NULL,
    "motorBoyName" TEXT,
    "outstandingStartNaira" INTEGER NOT NULL DEFAULT 0,
    "finalReturnBags" INTEGER NOT NULL DEFAULT 0,
    "cashReceivedNaira" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "totalLoadedBags" INTEGER NOT NULL DEFAULT 0,
    "totalSoldBags" INTEGER NOT NULL DEFAULT 0,
    "supplierBags" INTEGER NOT NULL DEFAULT 0,
    "normalBags" INTEGER NOT NULL DEFAULT 0,
    "expectedNaira" INTEGER NOT NULL DEFAULT 0,
    "receivedLoggedNaira" INTEGER NOT NULL DEFAULT 0,
    "outstandingEndNaira" INTEGER NOT NULL DEFAULT 0,
    "driverCommissionNaira" INTEGER NOT NULL DEFAULT 0,
    "motorBoyCommissionNaira" INTEGER NOT NULL DEFAULT 0,
    "expensesNaira" INTEGER NOT NULL DEFAULT 0,
    "driverCommissionRate" INTEGER NOT NULL DEFAULT 0,
    "motorBoyCommissionRate" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DriverDay_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DriverDay_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DriverDay" ("cashReceivedNaira", "dayId", "driverCommissionNaira", "driverProfileId", "expectedNaira", "expensesNaira", "finalReturnBags", "id", "motorBoyCommissionNaira", "motorBoyName", "normalBags", "notes", "outstandingEndNaira", "outstandingStartNaira", "receivedLoggedNaira", "supplierBags", "totalLoadedBags", "totalSoldBags", "totalTrips") SELECT "cashReceivedNaira", "dayId", "driverCommissionNaira", "driverProfileId", "expectedNaira", "expensesNaira", "finalReturnBags", "id", "motorBoyCommissionNaira", "motorBoyName", "normalBags", "notes", "outstandingEndNaira", "outstandingStartNaira", "receivedLoggedNaira", "supplierBags", "totalLoadedBags", "totalSoldBags", "totalTrips" FROM "DriverDay";
DROP TABLE "DriverDay";
ALTER TABLE "new_DriverDay" RENAME TO "DriverDay";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
