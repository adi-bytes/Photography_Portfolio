"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            setStatus("error");
            setMessage("Please select a valid image file.");
            return;
        }
        setFile(selectedFile);
        setStatus("idle");
        setMessage("");
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setStatus("success");
            setMessage("Photo successfully imported to gallery.");
            setFile(null);
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 font-sans">
            <div
                className={`relative flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed transition-colors ${isDragging
                    ? "border-neutral-400 bg-neutral-800/50"
                    : status === "error"
                        ? "border-red-900/50 bg-red-950/10"
                        : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/60"
                    }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onFileChange}
                    disabled={status === "uploading"}
                />
                <UploadCloud className="w-10 h-10 mb-4 text-neutral-500" />
                <p className="text-lg font-medium text-neutral-200">
                    Drop a new photo here
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                    JPEG, RAW, or TIFF. High resolution recommended.
                </p>
            </div>

            {file && status === "idle" && (
                <div className="flex items-center justify-between p-4 mt-4 border rounded-xl border-neutral-800 bg-neutral-900/80">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-white truncate">{file.name}</span>
                        <span className="text-xs text-neutral-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => setFile(null)}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}

            {status === "uploading" && (
                <div className="flex items-center gap-3 p-4 mt-4 border rounded-xl border-neutral-800 bg-neutral-900/80">
                    <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                    <span className="text-sm text-neutral-300">Extracting EXIF, Generating AI Tags, & Uploading...</span>
                </div>
            )}

            {status === "error" && (
                <div className="flex items-center gap-3 p-4 mt-4 border rounded-xl border-red-900/50 bg-red-950/30 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{message}</span>
                    <button onClick={() => setStatus("idle")} className="ml-auto p-1 hover:bg-red-900/30 rounded-md">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {status === "success" && (
                <div className="flex items-center gap-3 p-4 mt-4 border rounded-xl border-green-900/50 bg-green-950/30 text-green-400">
                    {/* <CheckCircle className="w-5 h-5 shrink-0" /> */}
                    <span className="text-sm">{message}</span>
                </div>
            )}
        </div>
    );
}
