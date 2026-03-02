import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow Vercel to run this longer than 15s if needed

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        // 1. Authenticate Request
        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch photos that lack category_tags or have an empty array
        const { data: photos, error: fetchError } = await supabase
            .from("photos")
            .select("id, url, title, alt_text")
            .or("category_tags.is.null,category_tags.eq.[]");

        if (fetchError || !photos) {
            return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
        }

        if (photos.length === 0) {
            return NextResponse.json({ success: true, message: "No photos need reprocessing." }, { status: 200 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey || geminiApiKey === "DUMMY_KEY") {
            return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
        }

        let processedCount = 0;

        // 3. Process each photo one by one to avoid rate limits
        for (const photo of photos) {
            try {
                // Fetch the image to get its buffer
                const imageRes = await fetch(photo.url);
                if (!imageRes.ok) continue;

                const arrayBuffer = await imageRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                // We'll guess MIME type from URL. Cloudinary usually serves jpeg or webp
                const mimeType = photo.url.includes(".png") ? "image/png" : "image/jpeg";

                // Call Gemini
                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: "Analyze this image. Provide a JSON response containing: 1. 'title' (a highly creative, moody, and poetic 1-4 word title). 2. 'altText' (a highly descriptive, SEO-optimized alt text of 1-3 sentences focusing on mood, subject, and lighting, without using 'A photo of'). 3. 'tags' (an array of 3-5 category strings like 'Landscape', 'Astrophotography', 'Architecture', 'Moody'). 4. 'colors' (an array of exactly 3 hex codes that represent the dominant mood and cinematic atmosphere of the image). 5. 'story' (a poetic 1-2 sentence 'director's cut' backstory for the image). Return ONLY valid JSON in the format {\"title\": \"...\", \"altText\": \"...\", \"tags\": [\"...\"], \"colors\": [\"...\"], \"story\": \"...\"} and nothing else. Do not use markdown blocks." },
                                {
                                    inlineData: {
                                        data: buffer.toString("base64"),
                                        mimeType: mimeType,
                                    }
                                }
                            ]
                        }]
                    })
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const sanitizedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                        const parsedResponse = JSON.parse(sanitizedText);

                        let newTitle = photo.title;
                        let newAltText = photo.alt_text;
                        let categoryTags = [];
                        let moodColors = [];
                        let story = null;

                        if (parsedResponse.title) newTitle = parsedResponse.title;
                        if (parsedResponse.altText) newAltText = parsedResponse.altText;
                        if (parsedResponse.tags && Array.isArray(parsedResponse.tags)) categoryTags = parsedResponse.tags;
                        if (parsedResponse.colors && Array.isArray(parsedResponse.colors)) moodColors = parsedResponse.colors;
                        if (parsedResponse.story) story = parsedResponse.story;

                        // Update Supabase
                        await supabase
                            .from("photos")
                            .update({
                                title: newTitle,
                                alt_text: newAltText,
                                category_tags: categoryTags,
                                mood_colors: moodColors,
                                story: story,
                            })
                            .eq("id", photo.id);

                        processedCount++;
                    }
                }
            } catch (err) {
                console.error(`Error reprocessing photo ${photo.id}:`, err);
                // Continue to next photo
            }
        }

        return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });
    } catch (error: any) {
        console.error("Reprocess handler error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
