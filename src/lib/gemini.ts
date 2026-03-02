import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateAltText(imageBuffer: Buffer, mimeType: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "Write a highly descriptive, SEO-optimized alt text (1-2 sentences) for this photography portfolio image. Focus on the mood, subject, and lighting, without using the phrase 'A photo of'." },
                        {
                            inlineData: {
                                data: imageBuffer.toString("base64"),
                                mimeType,
                            }
                        }
                    ],
                }
            ]
        });
        return response.text || "A cinematic photograph from the Obsidian Gallery.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "A cinematic photograph from the Obsidian Gallery.";
    }
}
