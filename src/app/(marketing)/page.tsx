
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ClipboardList, CheckCircle2, Droplets, ShieldCheck, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- A. Navigation --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link className="flex items-center gap-2 font-bold text-2xl text-blue-900" href="/">
            <Droplets className="h-7 w-7 text-blue-500 fill-blue-500" />
            <span>Kool Joo <span className="text-blue-500">Water</span></span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link className="text-sm font-semibold text-blue-900 hover:text-blue-500 transition-colors" href="/login">
              Login
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-blue-900 hover:bg-black text-white rounded-full px-6">
                Enter System
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* --- B. Hero Section --- */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col justify-center space-y-8 max-w-xl">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Refreshing Different
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tight text-blue-950 sm:text-6xl lg:text-7xl">
                    Kool Joo <br />
                    <span className="text-blue-600">Water</span>
                  </h1>
                  <p className="text-xl font-medium italic text-blue-800/80">
                    Premium Dispenser and Sachet Water, produced with care and managed with precision.
                  </p>
                  <p className="text-gray-600 leading-relaxed max-w-[600px]">
                    From daily production to deliveries, payments, and inventory — Kool Joo Water runs on a structured digital ledger built for accuracy and accountability.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button size="lg" className="bg-blue-900 hover:bg-black text-white h-14 px-8 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/10">
                      Enter Business System
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-blue-200 text-blue-900 h-14 px-8 rounded-xl font-bold text-lg bg-white/50 backdrop-blur">
                    View Products
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    src="/_art/official_dispenser_seal.jpg"
                    alt="Kool Joo 19L Dispenser Official Seal"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl border shadow-lg flex flex-col items-center gap-1 scale-90 sm:scale-100">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                    <span className="text-[10px] font-bold text-blue-950 uppercase tracking-widest">NAFDAC</span>
                    <span className="text-[8px] font-bold text-green-700">A1-8891</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle water splash decorations */}
          <div className="absolute top-2/3 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px]" />
        </section>

        {/* --- C. Products Section --- */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">What We Produce</h2>
              <p className="max-w-[700px] text-gray-500 dark:text-gray-400">
                Quality water products delivered with efficiency and tracked with digital precision.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Product 1 */}
              <div className="group relative overflow-hidden rounded-3xl border bg-white p-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 bg-blue-50">
                  <Image
                    src="/_art/kooljoo_dispenser_bottle_hero_1767357890745.png"
                    alt="Dispenser Water"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-6 pb-6 space-y-2">
                  <h3 className="text-2xl font-bold text-blue-950">Dispenser Water (19L)</h3>
                  <p className="text-gray-500">Ideal for homes, offices, and institutions. Tracked per delivery and bottle return to ensure zero losses.</p>
                  <ul className="pt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> 19 Litre Capacity
                    </li>
                    <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> BPA Free Bottles
                    </li>
                  </ul>
                </div>
              </div>
              {/* Product 2 */}
              <div className="group relative overflow-hidden rounded-3xl border bg-white p-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 bg-blue-50">
                  <Image
                    src="/_art/kooljoo_sachet_water_bags_1767357906635.png"
                    alt="Sachet Water"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-6 pb-6 space-y-2">
                  <h3 className="text-2xl font-bold text-blue-950">Sachet Water (Pure Water)</h3>
                  <p className="text-gray-500">Supplied in bags for retail and large events. Tracked per trip, per driver, and per day for total accountability.</p>
                  <ul className="pt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Supplied in Bags (20 Sachets)
                    </li>
                    <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Guaranteed Purity
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- D. Operations Section --- */}
        <section className="w-full py-24 bg-blue-950 text-white overflow-hidden relative">
          <div className="container px-4 md:px-8 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How Kool Joo Runs Daily</h2>
              <p className="max-w-[700px] text-blue-200/80">
                Transparency and accountability integrated into every step of our factory operations.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Daily Loading & Delivery",
                  desc: "Drivers load trucks with sachet and dispenser water. Every bag is recorded in the digital ledger.",
                  icon: Truck,
                  img: "/_art/kooljoo_delivery_operations_1767357923213.png"
                },
                {
                  title: "Sales & Payments Recorded",
                  desc: "Cash and transfers are logged in real-time. The ledger book transforms into a verifiable digital trail.",
                  icon: ClipboardList,
                  img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop"
                },
                {
                  title: "Owner Reviews & Approves",
                  desc: "Totals are audited daily. Every naira and bottle is accounted for with instant dashboard alerts.",
                  icon: CheckCircle2,
                  img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-6 items-center text-center">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image src={step.img} alt={step.title} fill className="object-cover brightness-90 hover:brightness-105 transition-all" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/50">
                      {i + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                      <step.icon className="w-5 h-5 text-blue-400" /> {step.title}
                    </h3>
                    <p className="text-blue-100/70 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Wave background effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none" />
        </section>

        {/* --- E. Trust & Compliance --- */}
        <section className="w-full py-20 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "NAFDAC Registered", icon: ShieldCheck },
                { label: "Factory Tracked", icon: ShoppingBag },
                { label: "Daily Ledger", icon: ClipboardList },
                { label: "Owner Audited", icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-blue-600">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-blue-950 text-center">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <p className="text-2xl font-bold text-blue-900 italic">"Every bag, every bottle, every naira is accounted for."</p>
            </div>
          </div>
        </section>
      </main>

      {/* --- F. Footer --- */}
      <footer className="w-full py-12 bg-blue-950 text-white border-t border-white/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link className="flex items-center gap-2 font-bold text-2xl" href="/">
                <Droplets className="h-6 w-6 text-blue-400 fill-blue-400" />
                <span>Kool Joo <span className="text-blue-400">Water</span></span>
              </Link>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                Refreshing Different. <br />
                Produced and packaged with the highest standards of hygiene and quality.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-blue-200/60">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Port Harcourt, Rivers State, Nigeria</p>
                <p>Enquiries: info@kooljoo.com</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <nav className="flex flex-col gap-2 text-sm text-blue-200/60">
                <Link href="/login" className="hover:text-blue-400 transition-colors">Business System</Link>
                <Link href="/login" className="hover:text-blue-400 transition-colors">Staff Portal</Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-4">Regulatory</h4>
              <div className="inline-flex flex-col border border-white/20 rounded-xl p-3 bg-white/5">
                <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Certified Factory</span>
                <span className="text-xs font-bold">NAFDAC No: A1-8891</span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-blue-200/40">
            <p>© {new Date().getFullYear()} Kool Joo Water Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

