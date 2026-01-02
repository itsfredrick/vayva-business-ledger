import { checkLicenseExpiry } from "@/lib/actions/license-actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // In production, verify a specialized header/token
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const result = await checkLicenseExpiry();
        return NextResponse.json({ success: true, ...result });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
