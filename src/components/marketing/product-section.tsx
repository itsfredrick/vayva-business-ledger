"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Droplets, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductSection() {
    const products = [
        {
            id: "dispenser",
            title: "Dispenser Water (19L)",
            subtitle: "Professional Hydration",
            image: "/images/dispenser_hero.png",
            description: "Ideal for offices and homes requiring consistent, large-scale supply.",
            bullets: [
                "Delivered with tracking and accountability",
                "BPA Free High Grade Polycarbonate",
                "Consistent daily delivery schedules",
                "Bottle return credit system"
            ],
            cta: "Request Delivery",
            link: "tel:09136000112",
            theme: "bg-blue-600 text-white"
        },
        {
            id: "sachet",
            title: "Sachet (Pure Water)",
            subtitle: "Bulk Distribution",
            image: "/images/sachet_studio.png",
            description: "Hygienically packaged 50cl bags for retail, events, and personal use.",
            bullets: [
                "Available for retail and bulk supply",
                "Reliable daily production capacity",
                "Perfect for events and large gatherings",
                "Great for distribution networks"
            ],
            cta: "Contact for Supply",
            link: "tel:08051189930",
            theme: "bg-slate-900 text-white"
        }
    ];

    return (
        <section id="products" className="w-full py-24 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Premium Catalog</p>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">
                        Our Products
                    </h2>
                    <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto">
                        Engineered for purity. Packaged for performance. Available for every scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {products.map((p) => (
                        <Card key={p.id} className="rounded-[40px] border-none shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col group h-full">
                            <div className="relative aspect-[16/10] bg-white overflow-hidden border-b border-slate-50">
                                <Image
                                    src={p.image}
                                    alt={p.title}
                                    fill
                                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-6 left-6">
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-8 lg:p-10 space-y-8 flex-1 flex flex-col justify-between bg-white">
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">{p.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{p.description}</p>

                                    <ul className="space-y-3 pt-3 border-t border-slate-50">
                                        {p.bullets.map((bullet) => (
                                            <li key={bullet} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-6">
                                    <Button asChild className={cn("w-full h-14 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 leading-none", p.theme)}>
                                        <a href={p.link} className="flex items-center justify-center gap-3">
                                            {p.cta}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
