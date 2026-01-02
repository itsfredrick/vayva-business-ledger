import { requireRole } from "@/lib/auth-checks";
import { getOfficeSales, getSalesSettings } from "@/lib/actions/sales-actions";
import { AddSaleDialog } from "@/components/sales/add-sale-dialog";
import { SalesTable } from "@/components/sales/sales-table";
import { Card } from "@/components/ui/card";

export default async function SalesPage() {
    await requireRole(["STAFF", "OWNER"]);

    const { sales, isEditable } = await getOfficeSales();
    const settings = await getSalesSettings();

    // Summary Computations
    const totalBags = sales.reduce((acc, s) => acc + s.bags, 0);
    const totalAmount = sales.reduce((acc, s) => acc + s.amountNaira, 0);
    const totalCash = sales.filter(s => s.paymentType === "CASH").reduce((acc, s) => acc + s.amountNaira, 0);
    const totalTransfer = sales.filter(s => s.paymentType === "TRANSFER").reduce((acc, s) => acc + s.amountNaira, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Office Sales</h1>
                    <p className="text-muted-foreground">Direct factory sales (Kitchen/Walk-in)</p>
                </div>
                <div>
                    <AddSaleDialog pricePerBag={settings.pricePerBag} isEditable={!!isEditable} />
                </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-100">
                    <div className="text-xs text-muted-foreground uppercase font-bold">Total Bags</div>
                    <div className="text-2xl font-bold">{totalBags.toLocaleString()}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-xs text-muted-foreground uppercase font-bold">Cash</div>
                    <div className="text-2xl font-bold">₦{totalCash.toLocaleString()}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-xs text-muted-foreground uppercase font-bold">Transfer</div>
                    <div className="text-2xl font-bold">₦{totalTransfer.toLocaleString()}</div>
                </Card>
                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-100">
                    <div className="text-xs text-muted-foreground uppercase font-bold text-green-700">Total Sales</div>
                    <div className="text-2xl font-bold text-green-700">₦{totalAmount.toLocaleString()}</div>
                </Card>
            </div>

            <SalesTable sales={sales} />
        </div>
    );
}
