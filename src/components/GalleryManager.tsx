"use client";

import { useState } from "react";
import { Photo } from "@/lib/types";

export default function GalleryManager({ initialPhotos }: { initialPhotos: Photo[] }) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isReprocessing, setIsReprocessing] = useState(false);
    const [reprocessStatus, setReprocessStatus] = useState("");

    const handleReprocess = async () => {
        if (!confirm("This will scan all photos missing Gemini AI metadata and generate new titles, tags, colors, and stories. This may take a minute. Proceed?")) return;

        setIsReprocessing(true);
        setReprocessStatus("Processing...");

        try {
            const res = await fetch("/api/admin/reprocess", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                setReprocessStatus(`Success! Processed ${data.processed} photos. Please refresh page.`);
            } else {
                setReprocessStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Reprocess error:", error);
            setReprocessStatus("Failed to communicate with server.");
        } finally {
            setIsReprocessing(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/photo/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPhotos(photos.filter(p => p.id !== id));
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.error}`);
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("An error occurred while deleting the photo.");
        } finally {
            setIsDeleting(null);
        }
    };

    if (photos.length === 0) {
        return <p className="text-neutral-500 italic mt-8">No photos in the gallery yet.</p>;
    }

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-white">Manage Gallery</h2>
                <div className="flex items-center gap-4">
                    {reprocessStatus && <span className="text-sm text-neutral-400">{reprocessStatus}</span>}
                    <button
                        onClick={handleReprocess}
                        disabled={isReprocessing}
                        className={`text-sm px-4 py-2 rounded font-medium border transition-colors ${isReprocessing
                                ? "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
                                : "bg-indigo-900/30 text-indigo-400 border-indigo-900/50 hover:bg-indigo-900/50"
                            }`}
                    >
                        {isReprocessing ? "Processing..." : "Run AI Backfill"}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="group relative border border-white/10 rounded-lg overflow-hidden bg-neutral-900 border-neutral-800 p-2 flex flex-col">
                        <div className="aspect-square relative overflow-hidden rounded bg-black mb-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo.url}
                                alt={photo.title}
                                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="flex-1 flex flex-col text-sm text-neutral-400">
                            <span className="font-medium text-white truncate" title={photo.title}>{photo.title}</span>
                            <span className="text-xs text-neutral-500 mt-1 truncate">
                                {photo.categoryTags?.join(", ") || "No tags"}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(photo.id, photo.title)}
                            disabled={isDeleting === photo.id}
                            className={`mt-4 w-full py-2 text-xs font-semibold rounded border ${isDeleting === photo.id
                                ? "bg-red-900/50 text-red-400 border-red-900/50 cursor-not-allowed"
                                : "text-red-400 border-red-900/50 hover:bg-red-900/30 transition-colors"
                                }`}
                        >
                            {isDeleting === photo.id ? "Deleting..." : "Delete Photo"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
