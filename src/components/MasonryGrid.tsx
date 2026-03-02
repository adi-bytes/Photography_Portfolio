"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";
import { Photo } from "@/lib/types";
import PhotoModal from "./PhotoModal";

export default function MasonryGrid({ photos }: { photos: Photo[] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4 sm:px-8 py-8 w-full max-w-[1600px] mx-auto">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                        className="mb-4 break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm bg-neutral-900"
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <CldImage
                            src={photo.url || photo.publicId}
                            alt={photo.altText || photo.title}
                            width={photo.width}
                            height={photo.height}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            format="auto"
                            quality="auto"
                            placeholder={photo.blurDataUrl ? "blur" : "empty"}
                            blurDataURL={photo.blurDataUrl}
                        />

                        {/* Subtle Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-gradient-to-t group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent transition-all duration-500 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
                            <h3 className="text-white font-serif text-xl tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{photo.title}</h3>
                            {photo.exif?.camera && (
                                <p className="text-white/70 font-sans text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase tracking-widest">
                                    {photo.exif.camera}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedPhoto && (
                <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
            )}
        </>
    );
}
