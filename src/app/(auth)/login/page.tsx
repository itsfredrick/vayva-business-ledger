import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Suspense fallback={<div className="w-[350px] h-[400px] bg-card animate-pulse rounded-xl" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
