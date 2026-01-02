import { requireRole } from "@/lib/auth-checks";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateInvoice } from "@/lib/actions/dispenser-actions";

export default async function DispenserBillingPage() {
    await requireRole(["OWNER"]);

    // Fetch all customers with 'MONTHLY' billing logic
    // And maybe see if they have unbilled deliveries?
    // Ideally we show a list of customers and "Last Invoice" or "Pending Value".

    const customers = await prisma.dispenserCustomer.findMany({
        where: { isActive: true, billingMode: "MONTHLY" },
        include: {
            deliveries: {
                where: {
                    paymentType: "MONTHLY",
                    invoiceLines: { none: {} } // Unbilled
                }
            },
            invoices: {
                take: 1,
                orderBy: { generatedAt: 'desc' }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Financial Yields</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Contract Settlement & Invoicing Engine</p>
                </div>
            </div>

            <div className="grid gap-8">
                {customers.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Archive Empty</p>
                    </div>
                ) : (
                    customers.map(c => {
                        const unbilledCount = c.deliveries.length;
                        const unbilledValue = c.deliveries.reduce((sum: number, d: any) => sum + d.amountExpectedNaira, 0);
                        const lastInvoice = c.invoices[0];

                        return (
                            <div key={c.id} className="bg-white rounded-[40px] p-10 ring-1 ring-slate-100 shadow-sm flex flex-col md:flex-row gap-10 justify-between">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-black tracking-tighter text-blue-950 uppercase">{c.name}</h3>
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{c.defaultAddress || "No Registered Address"}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Exposure</p>
                                            <p className="text-xl font-black text-blue-950">{c.owingBottles} <span className="text-xs font-bold opacity-30 italic">Units</span></p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agreed Rate</p>
                                            <p className="text-xl font-black text-emerald-600">₦{c.defaultRatePerBottle}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                                        {lastInvoice ? (
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-8 rounded-lg px-3 font-black text-[10px] uppercase tracking-widest border-blue-100 text-blue-600">
                                                    {lastInvoice.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    LAST: <strong>{lastInvoice.invoiceMonth}</strong> (₦{lastInvoice.totalAmountNaira.toLocaleString()})
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-40">No historical settlements</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end justify-between min-w-[240px]">
                                    <div className="text-left md:text-right space-y-2">
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Pending Settlement</p>
                                        <div className="text-5xl font-black text-blue-950 tracking-tighter tabular-nums">₦{unbilledValue.toLocaleString()}</div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unbilledCount} movements ready for cycle</p>
                                    </div>

                                    <div className="mt-8 md:mt-0 w-full md:w-auto">
                                        <GenerateInvoiceButton customerId={c.id} deliveryIds={c.deliveries.map((d: any) => d.id)} disabled={unbilledCount === 0} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}

// Inline component for simplicity? No, file separation is safer for Client Components.
import { GenerateInvoiceButton } from "@/components/dispenser/generate-invoice-button";
