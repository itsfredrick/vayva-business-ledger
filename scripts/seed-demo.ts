
import { PrismaClient, Role, DayStatus, RateType, BillingMode, PaymentType, DeliveryStatus, ExpenseStatus, TransferStatus, NotificationType, Severity, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Demo Seed...");

    // 1. CLEANUP
    console.log("🧹 Cleaning up transactional data...");
    await prisma.notification.deleteMany();
    await prisma.transferLog.deleteMany();
    await prisma.statementRow.deleteMany();
    await prisma.statementUpload.deleteMany();
    await prisma.dispenserInvoiceLine.deleteMany();
    await prisma.dispenserPayment.deleteMany();
    await prisma.dispenserInvoice.deleteMany();
    await prisma.dispenserDelivery.deleteMany();
    await prisma.supplierDelivery.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.koolJooOfficeSale.deleteMany();
    await prisma.driverDay.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.cashLedger.deleteMany();
    await prisma.inventoryDay.deleteMany();
    await prisma.dayRecord.deleteMany();

    // We clean static data too to ensure fresh IDs for connections, 
    // but in a real app you might match by Name. For demo, wipe it.
    await prisma.dispenserCustomer.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.license.deleteMany();
    await prisma.rateHistory.deleteMany();
    await prisma.companySettings.deleteMany();
    await prisma.user.deleteMany();

    console.log("✨ Database cleaned.");

    // 2. STATIC DATA

    // Users
    const passwordHash = await bcrypt.hash("password123", 10);

    const owner = await prisma.user.create({
        data: {
            name: "Chief Owner",
            username: "owner",
            email: "owner@kooljoo.com",
            password: passwordHash,
            role: "OWNER",
        }
    });

    const staff = await prisma.user.create({
        data: {
            name: "Manager Mike",
            username: "staff",
            email: "staff@kooljoo.com",
            password: passwordHash,
            role: "STAFF",
        }
    });

    console.log("users created");

    // Company Settings
    await prisma.companySettings.create({
        data: {
            name: "Kool Joo",
            sachetRetailPrice: 350,
            sachetSupplyPrice: 340,
            driverCommissionPerBag: 5,
            motorBoyCommissionPerBag: 3,
            dispenserDefaultRatePerBottle: 800,
            workdays: "Mon-Sat",
        }
    });

    // Bank Accounts
    const zenith = await prisma.bankAccount.create({
        data: { label: "Zenith Corp", bankName: "Zenith Bank", accountNumber: "1012345678" }
    });
    const opay = await prisma.bankAccount.create({
        data: { label: "OPay Collection", bankName: "OPay", accountNumber: "9098765432" }
    });

    // Driver Profiles
    const driversData = [
        { name: "Sani Abacha", motorBoy: "Musa" },
        { name: "John Bull", motorBoy: "Peter" },
        { name: "Emmanuel Kalu", motorBoy: "Chinedu" },
        { name: "Segun Arinze", motorBoy: "Tobi" },
        { name: "Ahmed Musa", motorBoy: "Ibrahim" },
        { name: "Friday James", motorBoy: "Samuel" },
    ];

    const driverProfiles = [];
    for (const d of driversData) {
        driverProfiles.push(await prisma.driverProfile.create({
            data: { name: d.name } // Motorboy is tracked per day in schema currently, usually defaulting? No, schemas says motorBoyName in DriverDay. Profile is just name.
        }));
    }

    // Dispenser Customers
    const customersData = [
        { name: "General Hospital", address: "1 Hospital Road", mode: "MONTHLY", rate: 800 },
        { name: "First Bank Plc", address: "Market Square", mode: "MONTHLY", rate: 850 },
        { name: "Mrs. Okon", address: "15 Peace drive", mode: "PER_DELIVERY", rate: 1000 },
        { name: "Hotel Royale", address: "GRA Phase 2", mode: "MONTHLY", rate: 750 },
        { name: "Mr. Badmus", address: "Flat 4, Aso Estate", mode: "PER_DELIVERY", rate: 1000 },
        { name: "Success School", address: "School Road", mode: "PER_DELIVERY", rate: 900 },
        { name: "Mama Chichi", address: "No 5", mode: "PER_DELIVERY", rate: 1000 },
        { name: "Pastor Paul", address: "Church Street", mode: "PER_DELIVERY", rate: 1000 },
        { name: "Fitness Gym", address: "Gym Road", mode: "PER_DELIVERY", rate: 900 },
        { name: "Tech Hub", address: "Innovation Close", mode: "PER_DELIVERY", rate: 1000 },
    ];

    for (const c of customersData) {
        await prisma.dispenserCustomer.create({
            data: {
                name: c.name,
                defaultAddress: c.address,
                billingMode: c.mode as BillingMode,
                defaultRatePerBottle: c.rate,
            }
        });
    }

    // Licenses
    const today = new Date();
    await prisma.license.create({
        data: { name: "NAFDAC Registration", licenseNumber: "A1-2345", expiryDate: new Date(today.getTime() + 86400000 * 200) } // Valid
    });
    await prisma.license.create({
        data: { name: "Local Govt Permit", licenseNumber: "LG-999", expiryDate: new Date(today.getTime() - 86400000 * 5) } // Expired 5 days ago
    });
    await prisma.license.create({
        data: { name: "Health Inspection", licenseNumber: "CERT-001", expiryDate: new Date(today.getTime() + 86400000 * 5) } // Expiring in 5 days
    });

    console.log("Static data seeded.");

    // 3. TODAY'S OPERATIONS

    // Open Day
    const day = new Date();
    day.setHours(0, 0, 0, 0);

    const dayRecord = await prisma.dayRecord.create({
        data: {
            date: day,
            status: "OPEN",
            openedById: staff.id,
        }
    });

    // Drivers for Today
    // Driver 1: Sani (Standard High Performance)
    const d1 = await prisma.driverDay.create({
        data: {
            dayId: dayRecord.id,
            driverProfileId: driverProfiles[0].id,
            motorBoyName: "Musa",
            outstandingStartNaira: 0,
            driverCommissionRate: 5,
            motorBoyCommissionRate: 3,
        }
    });

    // Trips for D1
    await prisma.trip.create({ data: { driverDayId: d1.id, gatePassNumber: "GP-001", departTime: new Date(new Date().setHours(8, 0)), returnTime: new Date(new Date().setHours(11, 0)), loadedBags: 120 } });
    await prisma.trip.create({ data: { driverDayId: d1.id, gatePassNumber: "GP-005", departTime: new Date(new Date().setHours(11, 30)), returnTime: new Date(new Date().setHours(14, 0)), loadedBags: 120 } });
    // D1 Returns
    await prisma.driverDay.update({
        where: { id: d1.id },
        data: {
            finalReturnBags: 10, // 240 - 10 = 230 Sold
            // Expected: 230 * 350 = 80,500
            // Comm: 230 * 8 = 1840
            // Net Expected: 78,660 (Not strictly subtracted from expected usually, but outstanding calc handles it)
            // Let's say he paid 78000
            cashReceivedNaira: 78000,

            // Recompute fields manually or rely on recompute engine? Seed script should ideally populate computed fields to be valid immediately.
            totalLoadedBags: 240,
            totalTrips: 2,
            totalSoldBags: 230,
            driverCommissionNaira: 230 * 5,
            motorBoyCommissionNaira: 230 * 3,
            expectedNaira: 230 * 350,
            receivedLoggedNaira: 78000,
            outstandingEndNaira: (0 + (230 * 350) - 78000 - (230 * 8)),
        }
    });

    // Driver 2: John (With Supplier Delivery)
    const d2 = await prisma.driverDay.create({
        data: {
            dayId: dayRecord.id,
            driverProfileId: driverProfiles[1].id,
            motorBoyName: "Peter",
            outstandingStartNaira: 5000, // Debtor
        }
    });
    await prisma.trip.create({ data: { driverDayId: d2.id, gatePassNumber: "GP-002", departTime: new Date(new Date().setHours(8, 15)), loadedBags: 100 } });
    // Supplier
    await prisma.supplierDelivery.create({
        data: {
            driverDayId: d2.id,
            supplierName: "Madam Rose",
            addressText: "Market Road 2",
            bags: 20,
            pricePerBag: 340,
            amountNaira: 20 * 340
        }
    });
    // D2 Updates
    const d2Sold = 80; // 100 loaded - 20 supplier = 80 normal sold (assuming 0 return)
    await prisma.driverDay.update({
        where: { id: d2.id },
        data: {
            totalTrips: 1,
            totalLoadedBags: 100,
            supplierBags: 20,
            normalBags: 80,
            totalSoldBags: 80,
            expectedNaira: (80 * 350) + (20 * 340), // 28000 + 6800 = 34800
            cashReceivedNaira: 30000,
            outstandingEndNaira: (5000 + 34800 - 30000 - (80 * 8)) // (Start + Exp - Rec - Comm) = 9160
        }
    });

    // Driver 3: Emmanuel (Transfers)
    const d3 = await prisma.driverDay.create({
        data: {
            dayId: dayRecord.id,
            driverProfileId: driverProfiles[2].id,
            motorBoyName: "Chinedu",
        }
    });
    await prisma.trip.create({ data: { driverDayId: d3.id, gatePassNumber: "GP-003", loadedBags: 150 } });
    // He sold 150, Expected 52500. He did a transfer.
    await prisma.transferLog.create({
        data: {
            driverDayId: d3.id,
            senderName: "Emmanuel Driver",
            amountNaira: 50000,
            bankAccountLabel: "Zenith Corp",
            status: "PENDING",
            claimedAt: new Date()
        }
    });
    // D3 Update (Received logged is 0 cash, but we track transfer too? Schema says receivedLoggedNaira usually implies Cash + confirmed transfers? 
    // Usually logic adds transfers to received. Let's assume for seed we just put logic results.
    // If transfer is PENDING, it might not count as received yet.
    await prisma.driverDay.update({
        where: { id: d3.id },
        data: {
            totalLoadedBags: 150,
            totalSoldBags: 150,
            expectedNaira: 52500,
            outstandingEndNaira: 52500 - (150 * 8) // 51300 outstanding until transfer approved
        }
    });

    // Office Sales
    await prisma.koolJooOfficeSale.create({
        data: {
            dayId: dayRecord.id,
            customerName: "Walk-in Customer",
            bags: 10,
            pricePerBag: 350,
            amountNaira: 3500,
            paymentType: "CASH",
            time: new Date(new Date().setHours(10, 0))
        }
    });
    const sale2 = await prisma.koolJooOfficeSale.create({
        data: {
            dayId: dayRecord.id,
            customerName: "Mrs. Johnson (Events)",
            bags: 50,
            pricePerBag: 350,
            amountNaira: 17500,
            paymentType: "TRANSFER",
            time: new Date(new Date().setHours(12, 0)),
            notes: "Wedding supply"
        }
    });
    await prisma.transferLog.create({
        data: {
            officeSaleId: sale2.id,
            senderName: "Johnson Events",
            amountNaira: 17500,
            bankAccountLabel: "OPay Collection",
            status: "PENDING"
        }
    });

    // Dispenser Deliveries
    // 1 Monthly
    const monthlyCust = await prisma.dispenserCustomer.findFirst({ where: { billingMode: "MONTHLY" } });
    if (monthlyCust) {
        await prisma.dispenserDelivery.create({
            data: {
                dayId: dayRecord.id,
                customerId: monthlyCust.id,
                bottlesDelivered: 5,
                bottlesReturned: 3,
                ratePerBottle: monthlyCust.defaultRatePerBottle,
                amountExpectedNaira: 5 * monthlyCust.defaultRatePerBottle,
                paymentType: "MONTHLY",
                deliveryStatus: "DELIVERED",
                owingBottles: monthlyCust.owingBottles + 5 - 3
            }
        });
    }
    // 1 Cash
    const cashCust = await prisma.dispenserCustomer.findFirst({ where: { billingMode: "PER_DELIVERY" } });
    if (cashCust) {
        await prisma.dispenserDelivery.create({
            data: {
                dayId: dayRecord.id,
                customerId: cashCust.id,
                bottlesDelivered: 50, // Big delivery
                bottlesReturned: 50,
                ratePerBottle: 800, // Bulk discount maybe?
                amountExpectedNaira: 40000,
                paymentType: "CASH",
                deliveryStatus: "DELIVERED",
            }
        });
    }

    // Expenses
    await prisma.expense.create({
        data: {
            dayId: dayRecord.id,
            whoTookMoney: "Manager Mike",
            category: "Fuel",
            amountNaira: 15000,
            reason: "Diesel for Generator",
            recordedByUserId: staff.id
        }
    });

    await prisma.expense.create({
        data: {
            dayId: dayRecord.id,
            whoTookMoney: "Security",
            category: "Food",
            amountNaira: 2000,
            reason: "Lunch",
            recordedByUserId: staff.id
        }
    });

    // Inventory
    await prisma.inventoryDay.create({
        data: {
            dayId: dayRecord.id,
            openingBags: 500,
            producedBags: 2000,
            spoilageBags: 15,
            outgoingDriverLoadsBags: 240 + 100 + 150, // 490
            outgoingOfficeSalesBags: 60,
            closingBagsComputed: 500 + 2000 - 15 - 490 - 60, // 1935
        }
    });

    console.log("Transactional data seeded.");

    // Statements Matching
    // Upload a statement that matches the Office Sale Transfer
    const upload = await prisma.statementUpload.create({
        data: {
            uploadedByUserId: owner.id,
            fromDate: day,
            toDate: day,
            fileUrl: "preview-statement.csv"
        }
    });

    // Row that matches Johnson Events
    const row1 = await prisma.statementRow.create({
        data: {
            statementUploadId: upload.id,
            postedAt: new Date(new Date().setHours(12, 5)), // 5 mins after sale
            senderName: "MRS JOHNSON WEDDING",
            amountNaira: 17500,
            reference: "REF123456"
        }
    });

    // Row unmatched
    await prisma.statementRow.create({
        data: {
            statementUploadId: upload.id,
            postedAt: new Date(),
            senderName: "UNKNOWN SENDER",
            amountNaira: 5000,
            reference: "REF999999"
        }
    });

    // Auto-match Logic Simulation (Linking row1 to sale2 transfer)
    const johnsonTransfer = await prisma.transferLog.findFirst({ where: { senderName: "Johnson Events" } });
    if (johnsonTransfer) {
        await prisma.transferLog.update({
            where: { id: johnsonTransfer.id },
            data: {
                status: "MATCHED_AUTO",
                matchedStatementRowId: row1.id
            }
        });
    }

    // Cash Ledger
    // In: 78000 (D1) + 30000 (D2) + 3500 (Office Cash) + 40000 (Dispenser Cash) = 151500
    // Spent: 17000
    // Net: 134500
    await prisma.cashLedger.create({
        data: {
            dayId: dayRecord.id,
            openingCashNaira: 5000,
            cashReceivedNaira: 151500,
            cashSpentNaira: 17000,
            closingCashNaira: 0, // Not closed yet
        }
    });

    console.log("✅ Demo Seed Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
