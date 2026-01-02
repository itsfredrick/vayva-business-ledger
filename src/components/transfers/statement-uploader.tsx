"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { uploadStatement } from "@/lib/actions/transfer-actions";

export function StatementUploader() {
    const [isPending, startTransition] = useTransition();

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                const res = await uploadStatement(formData);
                alert(`Processed ${res.count} rows.`);
            } catch (err) {
                alert("Upload failed: " + err);
            }
        });
    };

    return (
        <form onSubmit={handleUpload} className="flex gap-2 items-center border p-4 rounded-md bg-muted/40">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input name="file" type="file" required accept=".csv" />
            </div>
            <Button type="submit" disabled={isPending}>
                <Upload className="w-4 h-4 mr-2" />
                {isPending ? "Uploading..." : "Upload CSV Statement"}
            </Button>
        </form>
    );
}
