import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        // 1. Get the photo details to find the Cloudinary public_id
        const { data: photo, error: fetchError } = await supabase
            .from("photos")
            .select("public_id")
            .eq("id", id)
            .single();

        if (fetchError || !photo) {
            return NextResponse.json({ error: "Photo not found" }, { status: 404 });
        }

        // 2. Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(photo.public_id);
        } catch (cloudinaryError) {
            console.error("Failed to delete from Cloudinary:", cloudinaryError);
            // We proceed to delete from DB even if Cloudinary fails, to not leave zombie records
        }

        // 3. Delete from Supabase
        const { error: deleteError } = await supabase
            .from("photos")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Failed to delete from database:", deleteError);
            return NextResponse.json({ error: "Database delete failed" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Delete handler error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
