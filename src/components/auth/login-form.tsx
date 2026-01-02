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
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your username below to login to Vayva Business Ledger.</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" type="text" placeholder="owner" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </div>
                    <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button disabled={isPending} type="submit" className="w-full">
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
