"use client";

import Link from "next/link";
import { Droplets, Mail, Phone, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function MarketingHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* A) Top Utility Bar (SelectWater-style) */}
            <div className="bg-slate-50 border-b py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">
                <div className="container mx-auto px-6 lg:px-10 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-blue-400" />
                            <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-blue-400" />
                            <a href="tel:09136000112" className="hover:text-blue-600 transition-colors">09136000112</a>
                            <span className="text-slate-200">|</span>
                            <a href="tel:09136000113" className="hover:text-blue-600 transition-colors">09136000113</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-blue-400" />
                            <a href="mailto:evagracedpackagingvetures@gmail.com" className="hover:text-blue-600 transition-colors lowercase">evagracedpackagingvetures@gmail.com</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black tracking-tighter border-slate-200 text-slate-400 py-0 h-5 px-2">
                            NAFDAC AI-8891
                        </Badge>
                    </div>
                </div>
            </div>

            {/* B) Main Header (Sticky, Water.com-style) */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl">
                <div className="container mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                            <Droplets className="h-7 w-7 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-950 font-black text-2xl tracking-tighter leading-none uppercase italic">Kool Joo</span>
                            <span className="text-blue-600 font-bold text-[10px] tracking-[0.3em] uppercase leading-none mt-1">Refreshing Different</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {["Products", "Delivery & Supply", "Quality & Compliance", "Contact"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hidden lg:block text-[11px] font-black uppercase tracking-[0.2em] text-blue-950 hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                        <Button asChild className="rounded-2xl h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 hidden sm:flex">
                            <Link href="/app/today">Enter System</Link>
                        </Button>

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100">
                                    <Menu className="h-6 w-6 text-slate-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] border-none p-0">
                                <div className="bg-blue-950 p-8 h-full flex flex-col justify-between">
                                    <div className="space-y-12">
                                        <div className="flex items-center gap-3">
                                            <Droplets className="h-8 w-8 text-white fill-white" />
                                            <span className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none">Kool Joo</span>
                                        </div>
                                        <nav className="flex flex-col gap-8">
                                            {["Products", "Delivery & Supply", "Quality & Compliance", "Contact"].map((item) => (
                                                <a
                                                    key={item}
                                                    href={`#${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-lg font-black uppercase tracking-widest text-blue-200 hover:text-white transition-colors"
                                                >
                                                    {item}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                    <div className="space-y-4">
                                        <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black text-[11px] uppercase tracking-widest">
                                            <Link href="/login" onClick={() => setIsOpen(false)}>Staff Login</Link>
                                        </Button>
                                        <Button asChild className="w-full h-14 rounded-2xl bg-white text-blue-950 hover:bg-white/90 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-white/5">
                                            <Link href="/app/today" onClick={() => setIsOpen(false)}>Enter System</Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}
