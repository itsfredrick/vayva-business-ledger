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
    const totalBags = sales.reduce((acc: number, s: any) => acc + s.bags, 0);
    const totalAmount = sales.reduce((acc: number, s: any) => acc + s.amountNaira, 0);
    const totalCash = sales.filter((s: any) => s.paymentType === "CASH").reduce((acc: number, s: any) => acc + s.amountNaira, 0);
    const totalTransfer = sales.filter((s: any) => s.paymentType === "TRANSFER").reduce((acc: number, s: any) => acc + s.amountNaira, 0);

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Revenue Streams</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Kitchen & Walk-in Factory Sales</p>
                </div>
                <div>
                    <AddSaleDialog pricePerBag={settings.pricePerBag} isEditable={!!isEditable} />
                </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 rounded-[32px] bg-blue-50/50 ring-1 ring-blue-100 flex flex-col justify-between h-40 group hover:bg-blue-600 transition-all duration-500">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-200 transition-colors">Volume Sold</p>
                    <div className="text-4xl font-black text-blue-950 tracking-tighter group-hover:text-white transition-colors">{totalBags.toLocaleString()} <span className="text-xs font-bold opacity-40">Bags</span></div>
                </div>

                <div className="p-8 rounded-[32px] bg-white ring-1 ring-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash Liquidity</p>
                    <div className="text-3xl font-black text-blue-900 tracking-tighter tabular-nums">₦{totalCash.toLocaleString()}</div>
                </div>

                <div className="p-8 rounded-[32px] bg-white ring-1 ring-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Transfers</p>
                    <div className="text-3xl font-black text-blue-900 tracking-tighter tabular-nums">₦{totalTransfer.toLocaleString()}</div>
                </div>

                <div className="p-8 rounded-[32px] bg-green-50/50 ring-1 ring-green-100 flex flex-col justify-between h-40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <div className="w-16 h-16 bg-green-500 rounded-full blur-2xl" />
                    </div>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest relative z-10">Total Revenue</p>
                    <div className="text-4xl font-black text-green-700 tracking-tighter tabular-nums relative z-10">₦{totalAmount.toLocaleString()}</div>
                </div>
            </div>

            <div className="pt-2">
                <SalesTable sales={sales} />
            </div>
        </div>
    );
}
