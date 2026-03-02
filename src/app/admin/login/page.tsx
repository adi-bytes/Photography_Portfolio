"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <div className="flex bg-neutral-950 min-h-screen items-center justify-center p-6 text-neutral-200 font-sans">
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-8 shadow-xl">
                <h1 className="mb-2 text-2xl font-serif text-white text-center">Obsidian Admin</h1>
                <p className="mb-6 text-sm text-neutral-400 text-center">Sign in to manage your gallery.</p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400 border border-red-900/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-400" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                            placeholder="curator@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-400" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 rounded-lg bg-white p-2.5 text-sm font-medium text-black hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 transition-all font-sans"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
