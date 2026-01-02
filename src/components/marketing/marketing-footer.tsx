"use client";

import Link from "next/link";
import { Droplets, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function MarketingFooter() {
    return (
        <footer id="contact" className="bg-white border-t pt-32 pb-16">
            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Column 1: Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                                <Droplets className="h-7 w-7 text-white fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-950 font-black text-2xl tracking-tighter leading-none uppercase italic">Kool Joo</span>
                                <span className="text-blue-600 font-bold text-[10px] tracking-[0.3em] uppercase leading-none mt-1">Refreshing Different</span>
                            </div>
                        </Link>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-tight leading-relaxed max-w-xs">
                            Providing premium purification standards and reliable industrial-scale delivery across Lagos since 2026.
                        </p>
                    </div>

                    {/* Column 2: Products */}
                    <div className="space-y-10">
                        <h4 className="text-[11px] font-black text-blue-950 uppercase tracking-[0.3em] italic">Product Catalog</h4>
                        <nav className="flex flex-col gap-6">
                            <a href="#products" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Dispenser Water (19L)</a>
                            <a href="#products" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Sachet (Pure Water)</a>
                            <a href="#delivery-supply" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Bulk Logistics</a>
                            <a href="#delivery-supply" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Office Supply</a>
                        </nav>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="space-y-10">
                        <h4 className="text-[11px] font-black text-blue-950 uppercase tracking-[0.3em] italic">Direct Contact</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <a href="tel:09136000112" className="text-[11px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">09136000112</a>
                                    <a href="tel:09136000113" className="text-[11px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">09136000113</a>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                                <a href="mailto:evagracedpackagingvetures@gmail.com" className="text-[11px] font-black text-slate-900 hover:text-blue-600 transition-colors lowercase tracking-widest">evagracedpackagingvetures@gmail.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Compliance */}
                    <div className="space-y-10">
                        <h4 className="text-[11px] font-black text-blue-950 uppercase tracking-[0.3em] italic">Regulatory</h4>
                        <div className="space-y-6">
                            <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 space-y-2">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none uppercase">NAFDAC Certified</p>
                                <p className="text-xl font-black text-blue-950 uppercase italic tracking-tighter">AI-8891</p>
                            </div>
                            <div className="flex gap-4">
                                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight leading-relaxed">
                                    19, Princess Bola Kazeem Street, Shangisha Magodo, Ikosi Ketu Lagos Nigeria
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        © 2026 Kool Joo Water Company. All rights reserved.
                    </p>
                    <div className="flex gap-10">
                        <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy Policy</Link>
                        <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
