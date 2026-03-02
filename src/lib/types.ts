export interface Photo {
    id: string;
    publicId: string;
    url: string;
    width: number;
    height: number;
    blurDataUrl?: string; // For Next.js blur-up placeholder
    title: string;
    altText: string;
    slug: string;
    exif: {
        camera?: string;
        lens?: string;
        aperture?: string;
        focalLength?: string;
        iso?: string;
        shutterSpeed?: string;
    };
}
