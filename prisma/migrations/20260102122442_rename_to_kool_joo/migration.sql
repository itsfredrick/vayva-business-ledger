/*
  Warnings:

  - You are about to drop the `PurewaterOfficeSale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `email` on the `LoginAttempt` table. All the data in the column will be lost.
  - Added the required column `username` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PurewaterOfficeSale";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "KoolJooOfficeSale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerName" TEXT NOT NULL,
    "bags" INTEGER NOT NULL,
    "pricePerBag" INTEGER NOT NULL,
    "amountNaira" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "gatePassNumber" TEXT,
    "notes" TEXT,
    CONSTRAINT "KoolJooOfficeSale_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanySettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Kool Joo',
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "workdays" TEXT,
    "dayOpenTimeDefault" TEXT,
    "dayCloseTimeDefault" TEXT,
    "sachetRetailPrice" INTEGER NOT NULL DEFAULT 350,
    "sachetSupplyPrice" INTEGER NOT NULL DEFAULT 340,
    "driverCommissionPerBag" INTEGER NOT NULL DEFAULT 5,
    "motorBoyCommissionPerBag" INTEGER NOT NULL DEFAULT 3,
    "dispenserDefaultRatePerBottle" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CompanySettings" ("createdAt", "currency", "dayCloseTimeDefault", "dayOpenTimeDefault", "dispenserDefaultRatePerBottle", "driverCommissionPerBag", "id", "logoUrl", "motorBoyCommissionPerBag", "name", "primaryColor", "sachetRetailPrice", "sachetSupplyPrice", "updatedAt", "workdays") SELECT "createdAt", "currency", "dayCloseTimeDefault", "dayOpenTimeDefault", "dispenserDefaultRatePerBottle", "driverCommissionPerBag", "id", "logoUrl", "motorBoyCommissionPerBag", "name", "primaryColor", "sachetRetailPrice", "sachetSupplyPrice", "updatedAt", "workdays" FROM "CompanySettings";
DROP TABLE "CompanySettings";
ALTER TABLE "new_CompanySettings" RENAME TO "CompanySettings";
CREATE TABLE "new_LoginAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "ip" TEXT,
    "success" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LoginAttempt" ("id", "ip", "success", "timestamp") SELECT "id", "ip", "success", "timestamp" FROM "LoginAttempt";
DROP TABLE "LoginAttempt";
ALTER TABLE "new_LoginAttempt" RENAME TO "LoginAttempt";
CREATE TABLE "new_TransferLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT,
    "driverDayId" TEXT,
    "officeSaleId" TEXT,
    "dispenserDeliveryId" TEXT,
    "dispenserPaymentId" TEXT,
    "senderName" TEXT NOT NULL,
    "amountNaira" INTEGER NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bankAccountLabel" TEXT NOT NULL,
    "proofImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "matchedStatementRowId" TEXT,
    CONSTRAINT "TransferLog_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_driverDayId_fkey" FOREIGN KEY ("driverDayId") REFERENCES "DriverDay" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_officeSaleId_fkey" FOREIGN KEY ("officeSaleId") REFERENCES "KoolJooOfficeSale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_dispenserDeliveryId_fkey" FOREIGN KEY ("dispenserDeliveryId") REFERENCES "DispenserDelivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_dispenserPaymentId_fkey" FOREIGN KEY ("dispenserPaymentId") REFERENCES "DispenserPayment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_matchedStatementRowId_fkey" FOREIGN KEY ("matchedStatementRowId") REFERENCES "StatementRow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TransferLog" ("amountNaira", "bankAccountLabel", "claimedAt", "dayId", "dispenserDeliveryId", "dispenserPaymentId", "driverDayId", "id", "matchedStatementRowId", "officeSaleId", "proofImageUrl", "senderName", "status") SELECT "amountNaira", "bankAccountLabel", "claimedAt", "dayId", "dispenserDeliveryId", "dispenserPaymentId", "driverDayId", "id", "matchedStatementRowId", "officeSaleId", "proofImageUrl", "senderName", "status" FROM "TransferLog";
DROP TABLE "TransferLog";
ALTER TABLE "new_TransferLog" RENAME TO "TransferLog";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isActive", "name", "password", "role", "updatedAt", "username") SELECT "createdAt", "email", "id", "isActive", "name", "password", "role", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
