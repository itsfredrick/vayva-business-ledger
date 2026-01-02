"use client";

import { Building2, Home, Users, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketsSection() {
    const markets = [
        {
            icon: Home,
            title: "Homes & Families",
            desc: "Reliable drinking water supply for your household needs.",
            bullets: ["Scheduled delivery", "Hygienic handling", "Family-safe purity"]
        },
        {
            icon: Building2,
            title: "Offices & Workplaces",
            desc: "High-capacity supply to keep your team hydrated and productive.",
            bullets: ["Monthly billing", "Priority dispatch", "Professional supply"]
        },
        {
            icon: Users,
            title: "Distributors & Bulk",
            desc: "Industrial scale supply for retail networks and large events.",
            bullets: ["Bulk pricing", "Large-scale logistics", "Factory-direct rates"]
        }
    ];

    return (
        <section id="delivery-supply" className="py-32 bg-white">
            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Industrial Impact</p>
                    <h2 className="text-5xl md:text-6xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">
                        Markets We Serve
                    </h2>
                    <p className="text-lg text-slate-400 font-bold max-w-xl mx-auto italic">
                        Connecting premium hydration to every sector of Lagos life.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {markets.map((m) => (
                        <div key={m.title} className="bg-slate-50 p-10 rounded-[48px] border-none flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500">
                            <div className="space-y-8">
                                <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                    <m.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-blue-950 uppercase italic group-hover:text-white transition-colors">{m.title}</h3>
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed group-hover:text-blue-100 transition-colors uppercase tracking-tight">{m.desc}</p>
                                </div>
                                <ul className="space-y-3 pt-6 border-t border-slate-200 group-hover:border-blue-500/30 transition-colors">
                                    {m.bullets.map((b) => (
                                        <li key={b} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-3 h-3 text-blue-400 group-hover:text-blue-200 transition-colors" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-950 rounded-[48px] p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-900/40">
                    <div className="relative z-10 space-y-2 text-center lg:text-left">
                        <h3 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Need Regular Supply?</h3>
                        <p className="text-blue-300 font-bold text-sm lg:text-lg uppercase tracking-tight italic opacity-60">Establish your delivery sequence today.</p>
                    </div>
                    <Button asChild className="relative z-10 h-16 px-12 rounded-2xl bg-white text-blue-950 hover:bg-blue-50 font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 leading-none">
                        <a href="tel:09136000112" className="flex items-center gap-3">
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                    </Button>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-32" />
                </div>
            </div>
        </section>
    );
}
