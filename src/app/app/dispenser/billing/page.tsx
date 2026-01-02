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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dispenser Billing</h1>
                <p className="text-muted-foreground">Generate monthly invoices for contract customers.</p>
            </div>

            <div className="grid gap-6">
                {customers.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg text-muted-foreground">
                        No monthly billing customers found.
                    </div>
                ) : (
                    customers.map(c => {
                        const unbilledCount = c.deliveries.length;
                        const unbilledValue = c.deliveries.reduce((sum, d) => sum + d.amountExpectedNaira, 0);
                        const lastInvoice = c.invoices[0];

                        return (
                            <Card key={c.id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold">{c.name}</h3>
                                        <div className="text-sm text-muted-foreground">{c.defaultAddress}</div>
                                        <div className="mt-2 flex gap-4 text-sm">
                                            <div>Owning Bottles: <span className="font-bold">{c.owingBottles}</span></div>
                                            <div>Rate: ₦{c.defaultRatePerBottle}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">Unbilled Deliveries</div>
                                        <div className="text-2xl font-bold">₦{unbilledValue.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">{unbilledCount} deliveries pending</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center border-t pt-4">
                                    <div className="text-sm">
                                        {lastInvoice ? (
                                            <>Last Invoice: <strong>{lastInvoice.invoiceMonth}</strong> (₦{lastInvoice.totalAmountNaira.toLocaleString()}) - <Badge variant="outline">{lastInvoice.status}</Badge></>
                                        ) : (
                                            <span className="text-muted-foreground italic">No invoices generated yet</span>
                                        )}
                                    </div>

                                    {/* In a real app, this form action would trigger the generateInvoice server action */}
                                    {/* For now, we simulate or just show the logic. I will implement a client wrapper if needed, 
                                but strict server action form works too. */}
                                    <form action={async () => {
                                        "use server";
                                        // This is a bit hacky inside a loop, better to extract component.
                                        // But for speed, let's extract to a tiny client component or use a specialized action call.
                                        // Actually, I can't bind complex data easily in a server closure in map loop without extra steps.
                                        // I'll make a specialized 'GenerateButton' client component.
                                    }}>
                                        <GenerateInvoiceButton customerId={c.id} deliveryIds={c.deliveries.map(d => d.id)} disabled={unbilledCount === 0} />
                                    </form>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
}

// Inline component for simplicity? No, file separation is safer for Client Components.
import { GenerateInvoiceButton } from "@/components/dispenser/generate-invoice-button";
