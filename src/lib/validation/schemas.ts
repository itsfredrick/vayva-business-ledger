import { z } from "zod";

export const TripSchema = z.object({
    driverDayId: z.string().min(1, "Driver Day ID required"),
    gatePass: z.string().min(1, "Gate pass required").regex(/^GP-\d+$/, "Format: GP-XXXX"), // Example format, adjust strictly if needed or keep loose
    bags: z.coerce.number().min(1, "Must load at least 1 bag"),
    departTime: z.date().optional(),
    notes: z.string().optional()
});

export const DriverDayUpdateSchema = z.object({
    finalReturnBags: z.coerce.number().min(0, "Returns cannot be negative").optional(),
    cashReceivedNaira: z.coerce.number().min(0, "Cash cannot be negative").optional(),
    motorBoyName: z.string().optional()
});

export const SupplierDeliverySchema = z.object({
    driverDayId: z.string().min(1),
    supplierName: z.string().min(2, "Name too short"),
    bags: z.coerce.number().min(1, "Must be at least 1 bag"),
    price: z.coerce.number().min(1, "Price must be positive"),
    address: z.string().optional()
});

export const TransferLogSchema = z.object({
    driverDayId: z.string().optional(),
    officeSaleId: z.string().optional(),
    dispenserDeliveryId: z.string().optional(),
    senderName: z.string().min(2, "Sender name required"),
    amount: z.coerce.number().min(100, "Minimum transfer 100"),
    proofUrl: z.string().optional(),
    bankLabel: z.string().optional()
});

export const OfficeSaleSchema = z.object({
    customerName: z.string().min(2, "Customer name required"),
    bags: z.coerce.number().min(5, "Minimum 5 bags for office sales"),
    paymentType: z.enum(["CASH", "TRANSFER"]),
    gatePass: z.string().optional(),
    notes: z.string().optional(),
    time: z.date().optional()
});

export const InventoryUpdateSchema = z.object({
    producedBags: z.coerce.number().min(0, "Cannot be negative"),
    spoilageBags: z.coerce.number().min(0, "Cannot be negative"),
    closingBagsConfirmed: z.coerce.number().min(0, "Cannot be negative").optional(),
    notes: z.string().optional()
});

export const ExpenseSchema = z.object({
    whoTookMoney: z.string().min(2, "Name required"),
    category: z.string().min(2, "Category required"),
    amount: z.coerce.number().min(1, "Amount required"),
    reason: z.string().min(2, "Reason required"),
    receiptUrl: z.string().optional()
});
