"use client";

import { useActionState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/app/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <Card className="w-full bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-6 pt-8 text-center">
                <CardTitle className="text-2xl font-black text-blue-950 tracking-tight">Welcome Back</CardTitle>
                <CardDescription className="text-slate-500 font-medium text-sm">
                    Enter your credentials to access the ledger.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <CardContent className="space-y-5 px-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="e.g. owner"
                                required
                                className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 rounded-xl px-4 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 rounded-xl px-4 font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex h-6 items-center" aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <p className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-2">
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full h-12 bg-blue-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/10 transition-all active:scale-95"
                    >
                        {isPending ? "Authenticating..." : "Enter System"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
