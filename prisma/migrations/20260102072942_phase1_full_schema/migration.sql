/*
  Warnings:

  - You are about to drop the column `details` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entity` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `commissionRate` on the `CompanySettings` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerUnit` on the `CompanySettings` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `DayRecord` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - Added the required column `entityType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "RateHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rateType" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "effectiveFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedByUserId" TEXT NOT NULL,
    "reason" TEXT,
    CONSTRAINT "RateHistory_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DriverProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "DriverDay" (
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
    CONSTRAINT "DriverDay_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DriverDay_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverDayId" TEXT NOT NULL,
    "gatePassNumber" TEXT,
    "departTime" DATETIME,
    "returnTime" DATETIME,
    "loadedBags" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "Trip_driverDayId_fkey" FOREIGN KEY ("driverDayId") REFERENCES "DriverDay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupplierDelivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverDayId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "addressText" TEXT,
    "bags" INTEGER NOT NULL,
    "pricePerBag" INTEGER NOT NULL,
    "amountNaira" INTEGER NOT NULL,
    CONSTRAINT "SupplierDelivery_driverDayId_fkey" FOREIGN KEY ("driverDayId") REFERENCES "DriverDay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransferLog" (
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
    CONSTRAINT "TransferLog_officeSaleId_fkey" FOREIGN KEY ("officeSaleId") REFERENCES "PurewaterOfficeSale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_dispenserDeliveryId_fkey" FOREIGN KEY ("dispenserDeliveryId") REFERENCES "DispenserDelivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_dispenserPaymentId_fkey" FOREIGN KEY ("dispenserPaymentId") REFERENCES "DispenserPayment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_matchedStatementRowId_fkey" FOREIGN KEY ("matchedStatementRowId") REFERENCES "StatementRow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "StatementUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploadedByUserId" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromDate" DATETIME NOT NULL,
    "toDate" DATETIME NOT NULL,
    "fileUrl" TEXT NOT NULL,
    CONSTRAINT "StatementUpload_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatementRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statementUploadId" TEXT NOT NULL,
    "postedAt" DATETIME NOT NULL,
    "senderName" TEXT NOT NULL,
    "amountNaira" INTEGER NOT NULL,
    "reference" TEXT,
    CONSTRAINT "StatementRow_statementUploadId_fkey" FOREIGN KEY ("statementUploadId") REFERENCES "StatementUpload" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurewaterOfficeSale" (
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
    CONSTRAINT "PurewaterOfficeSale_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DispenserCustomer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "defaultAddress" TEXT,
    "billingMode" TEXT NOT NULL,
    "defaultRatePerBottle" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "DispenserDelivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "addressText" TEXT,
    "bottlesDelivered" INTEGER NOT NULL,
    "bottlesReturned" INTEGER NOT NULL DEFAULT 0,
    "owingBottles" INTEGER NOT NULL DEFAULT 0,
    "ratePerBottle" INTEGER NOT NULL,
    "amountExpectedNaira" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "deliveryStatus" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "DispenserDelivery_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispenserDelivery_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "DispenserCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DispenserInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "invoiceMonth" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalBottles" INTEGER NOT NULL DEFAULT 0,
    "totalAmountNaira" INTEGER NOT NULL DEFAULT 0,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedByUserId" TEXT NOT NULL,
    CONSTRAINT "DispenserInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "DispenserCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispenserInvoice_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DispenserInvoiceLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "bottlesDelivered" INTEGER NOT NULL,
    "ratePerBottle" INTEGER NOT NULL,
    "lineAmountNaira" INTEGER NOT NULL,
    CONSTRAINT "DispenserInvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "DispenserInvoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispenserInvoiceLine_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "DispenserDelivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DispenserPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountNaira" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "proofUrl" TEXT,
    "allocatedInvoiceId" TEXT,
    CONSTRAINT "DispenserPayment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "DispenserCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispenserPayment_allocatedInvoiceId_fkey" FOREIGN KEY ("allocatedInvoiceId") REFERENCES "DispenserInvoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whoTookMoney" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amountNaira" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "recordedByUserId" TEXT NOT NULL,
    "ownerReviewedStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "ownerReviewNote" TEXT,
    "ownerReviewedByUserId" TEXT,
    "ownerReviewedAt" DATETIME,
    CONSTRAINT "Expense_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_ownerReviewedByUserId_fkey" FOREIGN KEY ("ownerReviewedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CashLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "openingCashNaira" INTEGER NOT NULL DEFAULT 0,
    "cashReceivedNaira" INTEGER NOT NULL DEFAULT 0,
    "cashSpentNaira" INTEGER NOT NULL DEFAULT 0,
    "closingCashNaira" INTEGER NOT NULL DEFAULT 0,
    "varianceNaira" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CashLedger_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "openingBags" INTEGER NOT NULL DEFAULT 0,
    "producedBags" INTEGER NOT NULL DEFAULT 0,
    "spoilageBags" INTEGER NOT NULL DEFAULT 0,
    "outgoingDriverLoadsBags" INTEGER NOT NULL DEFAULT 0,
    "outgoingOfficeSalesBags" INTEGER NOT NULL DEFAULT 0,
    "closingBagsComputed" INTEGER NOT NULL DEFAULT 0,
    "closingBagsConfirmed" INTEGER,
    "varianceBags" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "InventoryDay_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "documentUrl" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "dayId" TEXT,
    "driverDayId" TEXT,
    "licenseId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedByUserId" TEXT,
    "acknowledgedAt" DATETIME,
    CONSTRAINT "Notification_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notification_driverDayId_fkey" FOREIGN KEY ("driverDayId") REFERENCES "DriverDay" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notification_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notification_acknowledgedByUserId_fkey" FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "action" TEXT NOT NULL,
    "oldJson" TEXT,
    "newJson" TEXT,
    "reason" TEXT,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("action", "entityId", "id", "timestamp", "userId") SELECT "action", "entityId", "id", "timestamp", "userId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE TABLE "new_CompanySettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'PureWater Company',
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
INSERT INTO "new_CompanySettings" ("createdAt", "currency", "id", "logoUrl", "name", "updatedAt") SELECT "createdAt", "currency", "id", "logoUrl", "name", "updatedAt" FROM "CompanySettings";
DROP TABLE "CompanySettings";
ALTER TABLE "new_CompanySettings" RENAME TO "CompanySettings";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayRecord_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DayRecord_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DayRecord" ("closedById", "createdAt", "date", "id", "openedById", "status", "updatedAt") SELECT "closedById", "createdAt", "date", "id", "openedById", "status", "updatedAt" FROM "DayRecord";
DROP TABLE "DayRecord";
ALTER TABLE "new_DayRecord" RENAME TO "DayRecord";
CREATE UNIQUE INDEX "DayRecord_date_key" ON "DayRecord"("date");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_name_key" ON "DriverProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CashLedger_dayId_key" ON "CashLedger"("dayId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryDay_dayId_key" ON "InventoryDay"("dayId");
