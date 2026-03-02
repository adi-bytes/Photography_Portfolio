import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminUploader from "@/components/AdminUploader";
import GalleryManager from "@/components/GalleryManager";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
        redirect("/admin/login");
    }

    // Fetch all photos for the Gallery Manager
    const { data: photos } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">Curator Dashboard</h1>
                        <p className="text-sm text-neutral-500">Manage your gallery, upload new works, and configure site settings.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-400">{authData.user.email}</span>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </header>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-white">Add to Gallery</h2>
                    </div>
                    <AdminUploader />
                </section>

                <section>
                    <GalleryManager initialPhotos={photos || []} />
                </section>
            </div>
        </div>
    );
}
