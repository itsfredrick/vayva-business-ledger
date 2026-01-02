"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    onRemove: () => void;
    value?: string;
    label?: string;
    accept?: string;
}

export function FileUpload({
    onUploadComplete,
    onRemove,
    value,
    label = "Upload Document",
    accept = "image/*,application/pdf",
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        try {
            const newBlob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/upload/token",
                onUploadProgress: (p) => {
                    setProgress(p.percentage);
                },
            });

            onUploadComplete(newBlob.url);
        } catch (error) {
            console.error("Upload failed:", error);
            // You could add a toast here
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = () => {
        onRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    {label}
                </label>

                {!value ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-300",
                            isUploading
                                ? "bg-slate-50 border-blue-200"
                                : "bg-white border-slate-100 hover:border-blue-300 hover:bg-blue-50/30"
                        )}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            accept={accept}
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-4 w-full px-8">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                <div className="w-full space-y-2 text-center">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                        Transmitting Sequence... {Math.round(progress)}%
                                    </p>
                                    <Progress value={progress} className="h-2 rounded-full bg-blue-100" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">
                                    Drop files or click to initiate upload
                                </p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">
                                    Supports Images & PDF (Max 4MB)
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative group bg-white p-6 rounded-[32px] ring-1 ring-slate-100 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                Upload Verified
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 truncate italic">
                                {value.split("/").pop()}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
