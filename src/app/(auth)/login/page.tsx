import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import { Droplets } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-blue-950 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3 mb-8 group transition-transform hover:scale-105">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
                        <Droplets className="h-7 w-7 text-blue-600 fill-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-2xl tracking-tighter leading-none">KOOL JOO</span>
                        <span className="text-blue-400 font-bold text-xs tracking-[0.3em] uppercase">Water Ledger</span>
                    </div>
                </Link>

                <Suspense fallback={<div className="w-full h-[400px] bg-white/5 animate-pulse rounded-3xl border border-white/10" />}>
                    <LoginForm />
                </Suspense>

                <p className="mt-8 text-blue-200/40 text-[10px] font-medium tracking-widest uppercase text-center leading-relaxed">
                    Official Management System <br />
                    Kool Joo Water Company © 2026
                </p>
            </div>
        </div>
    );
}
