"use client";

import { CheckCircle2, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComplianceSection() {
    return (
        <section id="quality-compliance" className="py-32 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[45%] bg-blue-400 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Quality & Hygiene */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Purity Sequence</p>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                Quality & Hygiene
                            </h2>
                            <p className="text-xl text-slate-400 font-bold max-w-xl italic">
                                Our multi-stage filtration process ensures that every drop of Kool Joo is analytically pure and refreshing.
                            </p>
                        </div>

                        <ul className="space-y-8">
                            {[
                                { title: "Multi-stage Filtration", desc: "Rigorous industrial process ensuring clinical purity and taste." },
                                { title: "Hygienically Packaged", desc: "Untouched by human hands during the critical sealing phase." },
                                { title: "Consistent Handling", desc: "Sanitized delivery fleet and strictly monitored production lines." }
                            ].map((item) => (
                                <li key={item.title} className="flex gap-6 group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                        <CheckCircle2 className="w-5 h-5 font-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight italic text-blue-200">{item.title}</h4>
                                        <p className="text-slate-500 font-bold text-sm tracking-tight uppercase">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Compliance Card (Yellow Accent) */}
                    <div className="relative group">
                        <div className="bg-[#FFD700] p-12 lg:p-16 rounded-[64px] text-blue-950 space-y-10 shadow-[0_50px_100px_-20px_rgba(255,215,0,0.2)] group-hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden">
                            {/* Visual Texture */}
                            <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-center bg-blue-950/5 p-4 rounded-3xl ring-1 ring-blue-950/10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">Statutory Identification</p>
                                    <ShieldCheck className="w-5 h-5 opacity-40" />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">NAFDAC REGISTRATION</p>
                                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none italic">AI-8891</h3>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-8 pt-10 border-t border-blue-950/10">
                                <div className="flex gap-6">
                                    <MapPin className="w-6 h-6 shrink-0 opacity-40" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Corporate Headquarters</p>
                                        <p className="text-[11px] font-black uppercase tracking-tight leading-relaxed max-w-[240px]">
                                            19, Princess Bola Kazeem Street, Shangisha Magodo, Ikosi Ketu Lagos Nigeria
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <Phone className="w-6 h-6 shrink-0 opacity-40" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Direct Dispatch Lines</p>
                                        <div className="flex flex-col gap-1">
                                            {["09136000112", "09136000113", "08056422007"].map(phone => (
                                                <a key={phone} href={`tel:${phone}`} className="text-[11px] font-black hover:underline underline-offset-4">{phone}</a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <Mail className="w-6 h-6 shrink-0 opacity-40" />
                                    <div className="space-y-1 text-xs">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Digital Correspondence</p>
                                        <a href="mailto:evagracedpackagingvetures@gmail.com" className="text-[11px] font-black hover:underline underline-offset-4 lowercase">evagracedpackagingvetures@gmail.com</a>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-10 right-10 rotate-12 opacity-5 pointer-events-none">
                                <ShieldCheck className="w-64 h-64" />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-6 -right-6 bg-blue-600 text-white p-6 rounded-[32px] shadow-2xl z-20 font-black text-[10px] uppercase tracking-[0.3em] italic">
                            Quality <br /> Guaranteed
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
