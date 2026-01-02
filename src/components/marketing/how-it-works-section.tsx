"use client";

import { Phone, CheckCircle2, Truck, PackageCheck, MousePointerClick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
    const steps = [
        {
            id: "01",
            icon: Phone,
            title: "Place Order",
            desc: "Contact us via WhatsApp, phone, or visit our factory outlet to establish your supply needs.",
            theme: "bg-blue-50 text-blue-600"
        },
        {
            id: "02",
            icon: PackageCheck,
            title: "Hygienic Execution",
            desc: "Our high-purity production lines process and package your order under clinical standards.",
            theme: "bg-emerald-50 text-emerald-600"
        },
        {
            id: "03",
            icon: Truck,
            title: "Swift Delivery",
            desc: "Our logistics fleet fulfills your delivery across Lagos with real-time tracking.",
            theme: "bg-amber-50 text-amber-600"
        }
    ];

    return (
        <section id="how-it-works" className="py-32 bg-white">
            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Supply Chain Transparency</p>
                    <h2 className="text-5xl md:text-6xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">
                        The Supply Sequence
                    </h2>
                    <p className="text-lg text-slate-400 font-bold max-w-xl mx-auto italic">
                        Three precise steps from our factory to your front door.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {steps.map((s) => (
                        <Card key={s.id} className="rounded-[48px] border-none bg-slate-50 group hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <CardContent className="p-12 space-y-8 relative">
                                <div className={`w-16 h-16 rounded-[24px] ${s.theme} flex items-center justify-center shadow-sm relative z-10`}>
                                    <s.icon className="w-8 h-8" />
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-2xl font-black text-blue-950 uppercase italic leading-none">{s.title}</h3>
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-tight">{s.desc}</p>
                                </div>

                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                    <span className="text-9xl font-black italic">{s.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-black text-blue-950 uppercase tracking-[0.2em]">
                        Monthly billing available for regular dispenser customers. <span className="text-blue-600 italic ml-2">Enterprise-ready supply management.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
