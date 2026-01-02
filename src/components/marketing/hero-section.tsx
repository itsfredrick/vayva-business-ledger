"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, CheckCircle2, Zap, Award, ShieldCheck } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full relative min-h-[70vh] flex items-center overflow-hidden bg-white pt-20 pb-20 lg:pb-32">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -z-10 rounded-l-[100px] transform translate-x-32 hidden lg:block" />
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Hero Content */}
                    <div className="space-y-10 order-1">
                        <div className="space-y-4">
                            <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">
                                Premium Hydration
                            </Badge>
                            <h1 className="text-5xl lg:text-7xl font-black text-blue-950 tracking-[ -0.04em] leading-[1.1] uppercase italic">
                                Refreshing <br /> Different<span className="text-blue-600">.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                                Authentic, high-purity water delivered to homes, offices, and distributors across Lagos.
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-md">
                                Kool Joo Water Company produces Dispenser (19L) and Sachet (Pure Water) with hygienic handling, consistent quality, and reliable delivery.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-xl shadow-blue-900/10 transition-all active:scale-95">
                                <a href="#products">View Products</a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl border-2 border-slate-200 text-blue-950 hover:bg-slate-50 font-bold text-sm transition-all active:scale-95">
                                <a href="tel:09136000112" className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    Call to Order
                                </a>
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-slate-100">
                            {[
                                { icon: ShieldCheck, label: "NAFDAC AI-8891", color: "text-emerald-500" },
                                { icon: Award, label: "Quality Proven", color: "text-blue-500" },
                                { icon: Zap, label: "Swift Delivery", color: "text-amber-500" },
                                { icon: CheckCircle2, label: "Hygienically Packaged", color: "text-cyan-500" },
                            ].map((chip) => (
                                <div key={chip.label} className="flex items-center gap-2">
                                    <chip.icon className={`w-4 h-4 ${chip.color}`} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{chip.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Hero Visual */}
                    <div className="relative group perspective-1000 order-2 mt-12 lg:mt-0">
                        <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto rounded-[3rem] bg-gradient-to-br from-white to-blue-50 shadow-2xl shadow-blue-900/10 border-8 border-white transition-all duration-700 hover:scale-[1.02] overflow-hidden">
                            {/* SVG Wave Subtle Overlay */}
                            <svg className="absolute bottom-0 w-full h-1/2 text-blue-100/30 -z-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                                <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,192C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>

                            <div className="absolute top-8 left-8 z-20">
                                <Badge className="bg-white/90 backdrop-blur shadow-lg border-white/20 px-3 py-1.5 rounded-full font-black text-[10px] text-blue-950 uppercase tracking-widest">
                                    NAFDAC AI-8891
                                </Badge>
                            </div>

                            <div className="relative h-full w-full flex items-center justify-center p-8 z-10">
                                <Image
                                    src="/images/dispenser_hero.png"
                                    alt="Kool Joo 19L Dispenser"
                                    width={400}
                                    height={600}
                                    className="object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Floating Glow */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-[100px] opacity-20 -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
