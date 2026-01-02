-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DispenserCustomer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "defaultAddress" TEXT,
    "billingMode" TEXT NOT NULL,
    "defaultRatePerBottle" INTEGER NOT NULL,
    "owingBottles" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_DispenserCustomer" ("billingMode", "defaultAddress", "defaultRatePerBottle", "id", "isActive", "name", "phone") SELECT "billingMode", "defaultAddress", "defaultRatePerBottle", "id", "isActive", "name", "phone" FROM "DispenserCustomer";
DROP TABLE "DispenserCustomer";
ALTER TABLE "new_DispenserCustomer" RENAME TO "DispenserCustomer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
