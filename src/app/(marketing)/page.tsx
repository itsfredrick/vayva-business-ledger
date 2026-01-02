import Link from "next/link";
import Image from "next/image";
import {
    Droplets,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Truck,
    Clock,
    BarChart3,
    Users,
    Building,
    Menu,
    ShoppingBag,
    Award,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">

            {/* 1. STICKY HEADER */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-[72px] flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Droplets className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-950 font-black text-xl tracking-tighter leading-tight uppercase">Kool Joo</span>
                            <span className="text-blue-600 font-bold text-[9px] tracking-[0.3em] uppercase leading-none">Water Company</span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <Link href="#products" className="hover:text-blue-600 transition-colors">Products</Link>
                        <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link>
                        <Link href="#quality" className="hover:text-blue-600 transition-colors">Quality</Link>
                        <Link href="#contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-black text-white font-bold rounded-full px-6 shadow-xl shadow-blue-600/10 transition-all active:scale-95">
                            <Link href="/app/today">Enter System</Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-grow">

                {/* 2. HERO SECTION */}
                <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />
                        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[45%] bg-blue-100 rounded-full blur-[100px]" />
                        <svg className="absolute bottom-0 w-full h-24 text-white fill-current" viewBox="0 0 1440 320">
                            <path d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,133.3C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="max-w-xl">
                                <Badge className="mb-6 bg-blue-50 text-blue-600 border-blue-100 font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                                    Premium Hydration
                                </Badge>
                                <h1 className="text-5xl lg:text-7xl font-black text-blue-950 tracking-tighter leading-[1.05] mb-6">
                                    Refreshing <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Different</span>.
                                </h1>
                                <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
                                    Authentic, high-purity water delivered to your home or office. Experience the Kool Joo standard of hygiene and reliability.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <Button asChild size="lg" className="h-14 px-10 rounded-full bg-blue-600 hover:bg-black text-lg font-bold shadow-2xl shadow-blue-600/20 transition-all">
                                        <Link href="#products">View Products</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-full border-slate-200 text-lg font-bold hover:bg-blue-50 transition-all">
                                        <Link href="/login">Enter Business System</Link>
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-2.5">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">NAFDAC Certified</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Swift Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Award className="w-5 h-5 text-blue-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Quality Proven</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                {/* Product Hero Visual */}
                                <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto rounded-[40px] overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(30,58,138,0.25)] border-8 border-white transition-transform duration-500 group-hover:scale-[1.02]">
                                    <Image
                                        src="/_art/hero_dispenser.png"
                                        alt="Kool Joo 19L Dispenser"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute top-8 left-8">
                                        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-4 border flex flex-col items-center gap-1.5">
                                            <ShieldCheck className="w-10 h-10 text-green-600" />
                                            <span className="text-[10px] font-black text-blue-950 tracking-tighter uppercase leading-none">Official Label</span>
                                            <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 rounded-full">A1-8891</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating decor */}
                                <div className="absolute -bottom-6 -right-6 lg:-right-12 w-32 h-32 bg-blue-100 rounded-2xl -z-10 blur-2xl opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. OFFERINGS SECTION */}
                <section id="services" className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl font-black text-blue-950 tracking-tight mb-4">Water, Your Way.</h2>
                            <p className="text-lg text-slate-600 font-medium">Choose from our versatile range of hydration services tailored for homes, offices, and distribution centers.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: Droplets, title: "Dispenser Water", desc: "Premium 19L bottles with complete return & tracking management." },
                                { icon: ShoppingBag, title: "Sachet Water", desc: "Clean and hygienic pure water bags for daily retail and personal use." },
                                { icon: Truck, title: "Bulk Supply", desc: "Special pricing for multi-unit distributions and large events." },
                                { icon: Building, title: "Office Solutions", desc: "Automated monthly billing and consistent supply for businesses." },
                                { icon: BarChart3, title: "Delivery Tracking", desc: "Every bottle and bag is logged in our system for full accountability." },
                                { icon: ShieldCheck, title: "Quality Control", desc: "Rigorous daily testing and NAFDAC compliant production lines." },
                            ].map((item, idx) => (
                                <Card key={idx} className="group border-0 shadow-none bg-slate-50 hover:bg-blue-50 transition-colors duration-300 rounded-3xl p-6">
                                    <CardContent className="p-0">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-1">
                                            <item.icon className="w-7 h-7 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-blue-950 mb-3">{item.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
                                        <Link href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
                                            Learn more <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. QUALITY MATTERS */}
                <section id="quality" className="py-24 bg-slate-900 text-white overflow-hidden">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
                                <Image
                                    src="/_art/lifestyle_pouring.png"
                                    alt="Quality Water Dispensing"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-lg font-bold italic">"Consistency in every drop is what makes us Kool Joo."</p>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black tracking-tight leading-tight">Quality Isn't Just a <span className="text-blue-400 italic">Promise</span>.</h2>
                                    <p className="text-xl text-slate-300 font-medium leading-relaxed">It's encoded in our daily production logs and rigorous filtration standards.</p>
                                </div>
                                <ul className="space-y-6">
                                    {[
                                        { title: "7-Stage Filtration", desc: "Industry-leading process ensuring clinical purity and taste." },
                                        { title: "Daily Batch Testing", desc: "We sample every batch for micro-biological and chemical safety." },
                                        { icon: ShieldCheck, title: "NAFDAC Approved", desc: "Fully compliant with national regulatory standards (No: A1-8891)." },
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-5">
                                            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                                                <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Button size="lg" className="h-14 px-10 rounded-full bg-blue-600 hover:bg-white hover:text-blue-900 font-bold transition-all shadow-xl shadow-blue-500/20">
                                    Our Quality Process
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. HOW IT WORKS */}
                <section id="how-it-works" className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-blue-950 tracking-tight">Simple. Reliable. Swift.</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Place Order", desc: "Contact us via WhatsApp, phone, or visit our factory outlet.", img: "/_art/kooljoo_sachet_water_bags_1767357906635.png" },
                                { step: "02", title: "We Deliver", desc: "Our fleet of tracked delivery vans ensures swift fulfillment.", img: "/_art/delivery_truck.png" },
                                { step: "03", title: "Enjoy & Rotate", desc: "Drink pure, return empty bottles, and maintain your hydration.", img: "/_art/kooljoo_dispenser_bottle_hero_1767357890745.png" },
                            ].map((item, idx) => (
                                <div key={idx} className="relative group p-4 rounded-[32px] border border-transparent hover:border-slate-100 transition-all">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-lg">
                                        <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/95 backdrop-blur flex items-center justify-center font-black text-blue-600 shadow-xl">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-950 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 bg-blue-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                                    <Clock className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-blue-950">Subscription Billing</h4>
                                    <p className="text-blue-900/60 font-medium">Monthly billing options available for office dispenser customers.</p>
                                </div>
                            </div>
                            <Button className="rounded-full bg-blue-950 hover:bg-black font-bold h-12 px-8">Inquire Now</Button>
                        </div>
                    </div>
                </section>

                {/* 6. PRODUCTS PREVIEW */}
                <section id="products" className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-10">
                            <Card className="rounded-[40px] overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                                <div className="relative aspect-[16/10]">
                                    <Image src="/_art/hero_dispenser.png" alt="Dispenser 19L" fill className="object-cover" />
                                </div>
                                <CardContent className="p-10 space-y-6 bg-white">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-3xl font-black text-blue-950 tracking-tighter">Dispenser Water (19L)</h3>
                                        <Badge className="bg-blue-600">Standard</Badge>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> BPA Free High Grade Polycarbonate</li>
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Multi-stage Purification Process</li>
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Bottle Return Credit System</li>
                                    </ul>
                                    <Button size="lg" className="w-full rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-lg font-black shadow-xl shadow-blue-600/20">Request Delivery</Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[40px] overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                                <div className="relative aspect-[16/10]">
                                    <Image src="/_art/sachet_product.png" alt="Pure Water Sachet" fill className="object-cover" />
                                </div>
                                <CardContent className="p-10 space-y-6 bg-white">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-3xl font-black text-blue-950 tracking-tighter">Sachet (Pure Water)</h3>
                                        <Badge className="bg-blue-600">Bulk</Badge>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 50cl Bags - 20 Sachets per Bag</li>
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Factory Fresh Production Daily</li>
                                        <li className="flex items-center gap-3 text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Distributor & Supplier Discounts</li>
                                    </ul>
                                    <Button size="lg" className="w-full rounded-2xl h-14 bg-slate-100 hover:bg-slate-200 text-blue-950 text-lg font-black transition-all">Contact for Supply</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* 7. SYSTEM PREVIEW */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="rounded-[4rem] bg-gradient-to-br from-blue-900 to-blue-950 p-8 lg:p-20 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(29,78,216,0.3)]">

                            <div className="absolute top-0 right-0 w-[60%] h-full opacity-10 pointer-events-none">
                                <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-white rounded-full blur-[120px]" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">Built for Accurate <br />Daily Records.</h2>
                                    <p className="text-xl text-blue-200 font-medium leading-relaxed">Our proprietary business system ensures every bag, bottle, and naira is accounted for. Total transparency from factory to front door.</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button asChild size="lg" className="h-14 px-10 rounded-full bg-white text-blue-950 hover:bg-blue-50 font-black shadow-2xl transition-all">
                                            <Link href="/app/today">Enter System</Link>
                                        </Button>
                                        <Button asChild variant="ghost" size="lg" className="h-14 px-10 rounded-full text-white hover:bg-white/10 font-bold transition-all">
                                            <Link href="/login">Staff Login</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl transition-transform duration-700 group-hover:rotate-1 group-hover:scale-[1.03]">
                                        {/* Mock Dashboard UI */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-white/10 rounded-xl p-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Live Dashboard</span>
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white/90 p-4 rounded-2xl">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sachet Sold</span>
                                                    <div className="text-lg font-black text-blue-950">1,240 <span className="text-[10px] text-slate-400">Bags</span></div>
                                                </div>
                                                <div className="bg-white/90 p-4 rounded-2xl">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
                                                    <div className="text-lg font-black text-blue-950">₦248,000</div>
                                                </div>
                                            </div>
                                            <div className="bg-blue-600/20 rounded-2xl p-4 border border-blue-400/30">
                                                <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Dispenser Delivery</span>
                                                <div className="flex justify-between items-end mt-1">
                                                    <div className="text-xl font-black text-white">84 <span className="text-xs text-blue-200 font-medium">Bottles</span></div>
                                                    <div className="text-[10px] font-bold text-green-300">100% Fulfilled</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* 8. FOOTER */}
            <footer id="contact" className="bg-white border-t pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div className="space-y-6">
                            <Link href="/" className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <Droplets className="h-6 w-6 text-white fill-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-blue-950 font-black text-xl tracking-tighter uppercase leading-tight">Kool Joo</span>
                                    <span className="text-blue-600 font-bold text-[9px] tracking-[0.3em] uppercase">Water Company</span>
                                </div>
                            </Link>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[240px]">
                                Providing premium purification standards and reliable delivery since 2026. Refreshing Different.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-blue-950 uppercase tracking-widest text-xs mb-6">Contact Us</h4>
                            <ul className="space-y-4 text-sm font-semibold text-slate-600">
                                <li>Factory Road, Lagos Nigeria</li>
                                <li>+234 800 KOOL JOO</li>
                                <li>hello@kooljoo.com</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-blue-950 uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                            <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
                                <Link href="#products" className="hover:text-blue-600">Products</Link>
                                <Link href="#quality" className="hover:text-blue-600">Quality Matters</Link>
                                <Link href="#how-it-works" className="hover:text-blue-600">How It Works</Link>
                                <Link href="/login" className="hover:text-blue-600">Staff Login</Link>
                            </nav>
                        </div>

                        <div>
                            <h4 className="font-black text-blue-950 uppercase tracking-widest text-xs mb-6">Regulatory</h4>
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block">Quality Assured</span>
                                <span className="text-sm font-black text-blue-950 block">NAFDAC No: A1-8891</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <p>© 2026 Kool Joo Water Company. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
                            <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
