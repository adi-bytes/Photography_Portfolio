"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Photo } from "@/lib/types";

export default function PhotoModal({ photo, onClose }: { photo: Photo | null; onClose: () => void }) {
    if (!photo) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" strokeWidth={1.5} />
                </button>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    className="relative max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Main Image */}
                    <div className="relative w-full h-[80vh] sm:h-[85vh]">
                        <Image
                            src={photo.url}
                            alt={photo.altText || photo.title}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                            placeholder={photo.blurDataUrl ? "blur" : "empty"}
                            blurDataURL={photo.blurDataUrl}
                        />

                        {/* Glassmorphic Metadata Overlay */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto sm:w-80 glass p-5 rounded-xl text-left"
                        >
                            <h2 className="font-serif text-xl sm:text-2xl text-white mb-1 tracking-wide">{photo.title}</h2>
                            <p className="text-white/60 text-xs sm:text-sm font-sans mb-4 line-clamp-2">{photo.altText}</p>

                            {photo.exif && (
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono text-white/80 border-t border-white/10 pt-4">
                                    {photo.exif.camera && (
                                        <div className="col-span-2 flex flex-col">
                                            <span className="text-white/40 mb-0.5 font-sans">Camera</span>
                                            <span className="truncate">{photo.exif.camera}</span>
                                        </div>
                                    )}
                                    {photo.exif.lens && (
                                        <div className="col-span-2 flex flex-col">
                                            <span className="text-white/40 mb-0.5 font-sans">Lens</span>
                                            <span className="truncate">{photo.exif.lens}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-white/40 mb-0.5 font-sans">Aperture</span>
                                        <span>{photo.exif.aperture}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/40 mb-0.5 font-sans">Shutter</span>
                                        <span>{photo.exif.shutterSpeed}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/40 mb-0.5 font-sans">Focal Length</span>
                                        <span>{photo.exif.focalLength}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/40 mb-0.5 font-sans">ISO</span>
                                        <span>{photo.exif.iso}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
