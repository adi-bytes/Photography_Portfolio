import MasonryGrid from "@/components/MasonryGrid";
import { Photo } from "@/lib/types";

// Dummy data for initial gallery aesthetics before DB integration
const placeholderPhotos: Photo[] = [
  {
    id: "1",
    publicId: "placeholder-1",
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop",
    width: 2070,
    height: 1380,
    title: "Yosemite Valley",
    altText: "A sweeping view of Yosemite Valley at golden hour, capturing the majestic granite cliffs and serene valley floor.",
    slug: "yosemite-valley",
    exif: {
      camera: "Sony A7R IV",
      lens: "FE 16-35mm F2.8 GM",
      aperture: "f/8.0",
      focalLength: "24mm",
      iso: "100",
      shutterSpeed: "1/250s",
    }
  },
  {
    id: "2",
    publicId: "placeholder-2",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop",
    width: 2074,
    height: 2765,
    title: "Nordic Silence",
    altText: "A solitary figure walks along a dramatic, moody shoreline under overcast skies in a Nordic landscape.",
    slug: "nordic-silence",
    exif: {
      camera: "Fujifilm GFX 100S",
      lens: "GF 32-64mm F4 R LM WR",
      aperture: "f/5.6",
      focalLength: "45mm",
      iso: "400",
      shutterSpeed: "1/125s",
    }
  },
  {
    id: "3",
    publicId: "placeholder-3",
    url: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1975&auto=format&fit=crop",
    width: 1975,
    height: 2963,
    title: "Urban Geometry",
    altText: "Abstract perspective of modern architecture with strong leading lines and contrasting shadows.",
    slug: "urban-geometry",
    exif: {
      camera: "Leica Q2",
      lens: "Summilux 28mm f/1.7 ASPH.",
      aperture: "f/1.7",
      focalLength: "28mm",
      iso: "1600",
      shutterSpeed: "1/60s",
    }
  },
  {
    id: "4",
    publicId: "placeholder-4",
    url: "https://images.unsplash.com/photo-1682687982185-531d09ec56fc?q=80&w=2070&auto=format&fit=crop",
    width: 2070,
    height: 1380,
    title: "Desert Dunes",
    altText: "Expansive desert sand dunes with dramatic ridges and deep shadows resulting from low angle sun.",
    slug: "desert-dunes",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 70-200mm F2.8 L IS USM",
      aperture: "f/11",
      focalLength: "135mm",
      iso: "200",
      shutterSpeed: "1/500s",
    }
  },
  {
    id: "5",
    publicId: "placeholder-5",
    url: "https://images.unsplash.com/photo-1682695794816-7b9da18ed470?q=80&w=2070&auto=format&fit=crop",
    width: 2070,
    height: 3105,
    title: "Glacial Ice",
    altText: "Close up abstraction of deep blue glacial ice with intricate textures and cracks.",
    slug: "glacial-ice",
    exif: {
      camera: "Nikon Z9",
      lens: "NIKKOR Z 100-400mm f/4.5-5.6 VR S",
      aperture: "f/8",
      focalLength: "400mm",
      iso: "800",
      shutterSpeed: "1/1000s",
    }
  }
];

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  const displayPhotos = photos && photos.length > 0 ? photos : placeholderPhotos;

  return (
    <main className="min-h-screen bg-black w-full flex flex-col items-center">
      {/* Museum Header */}
      <header className="w-full text-center py-20 px-8 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-black to-neutral-950/50">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          OBSIDIAN
        </h1>
        <p className="font-sans text-neutral-400 text-sm md:text-base tracking-[0.2em] uppercase max-w-xl mx-auto">
          A Cinematic Photography Portfolio
        </p>
      </header>

      {/* Gallery Grid */}
      <div className="w-full flex-grow bg-black">
        <MasonryGrid photos={displayPhotos} />
      </div>

      {/* Minimal Footer */}
      <footer className="w-full py-12 text-center text-neutral-600 font-sans text-xs uppercase tracking-widest border-t border-white/5">
        &copy; {new Date().getFullYear()} Obsidian Gallery. All rights reserved.
      </footer>
    </main>
  );
}
