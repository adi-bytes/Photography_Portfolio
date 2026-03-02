import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { generateAltText } from "@/lib/gemini";
import exifr from "exifr";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        // 1. Authenticate Request
        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse FormData
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Extract EXIF data
        let exifData = {};
        try {
            const parsedExif = await exifr.parse(buffer, {
                tiff: true,
                exif: true,
                gps: false,
            });

            if (parsedExif) {
                exifData = {
                    camera: parsedExif.Make || parsedExif.Model ? `${parsedExif.Make || ''} ${parsedExif.Model || ''}`.trim() : undefined,
                    lens: parsedExif.LensModel,
                    aperture: parsedExif.FNumber ? `f/${parsedExif.FNumber}` : undefined,
                    focalLength: parsedExif.FocalLength ? `${parsedExif.FocalLength}mm` : undefined,
                    iso: parsedExif.ISO ? `ISO ${parsedExif.ISO}` : undefined,
                    shutterSpeed: parsedExif.ExposureTime ? `1/${Math.round(1 / parsedExif.ExposureTime)}s` : undefined,
                };
            }
        } catch (e) {
            console.warn("Failed to parse EXIF:", e);
        }

        // 4. Generate AI Alt Text
        const altText = await generateAltText(buffer, file.type);

        // 5. Generate Title and Slug
        // We can use the original filename (stripped of extension) as a base
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-]/g, " ").trim();
        const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        const uniqueHash = Math.random().toString(36).substring(2, 8);
        const slug = `${baseName.toLowerCase().replace(/\s+/g, '-')}-${uniqueHash}`;

        // 6. Upload to Cloudinary via stream
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "obsidian_gallery",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            // Write buffer to stream
            uploadStream.end(buffer);
        });

        // Extract Cloudinary data
        const { secure_url, public_id, width, height } = uploadResult;

        // 7. Save to Supabase
        const { data: dbData, error: dbError } = await supabase
            .from("photos")
            .insert({
                public_id,
                url: secure_url,
                width,
                height,
                title: title || "Untitled",
                alt_text: altText,
                slug,
                exif: exifData,
            })
            .select()
            .single();

        if (dbError) {
            console.error("Supabase insert error:", dbError);
            return NextResponse.json({ error: "Failed to save photo metadata" }, { status: 500 });
        }

        // 8. Return success
        return NextResponse.json({ success: true, photo: dbData }, { status: 201 });

    } catch (error: any) {
        console.error("Upload handler error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
