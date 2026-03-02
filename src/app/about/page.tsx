import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Obsidian Gallery",
    description: "The artist behind the Obsidian cinematic photography portfolio.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black w-full flex flex-col items-center pt-32 pb-20 px-8">
            <div className="max-w-3xl w-full">
                <header className="mb-16">
                    <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 tracking-wide">
                        The Curator
                    </h1>
                    <div className="h-[1px] w-24 bg-white/20" />
                </header>

                <div className="space-y-8 font-sans text-neutral-300 leading-relaxed text-lg pb-16">
                    <p>
                        Welcome to Obsidian. What began as a personal archive has evolved into an ongoing visual thesis exploring light, shadow, and the profound quiet found in fleeting moments.
                    </p>
                    <p>
                        My work focuses inherently on <span className="text-white font-medium">cinematic storytelling</span>—stripping away visual noise to discover the raw emotion underneath. I believe that photography is not merely documenting reality, but isolating a specific atmosphere that words cannot easily convey.
                    </p>
                    <p>
                        Whether I am in the rugged vastness of a Nordic highland or the geometric shadows of a sleepless metropolis, my goal remains the same: to capture stillness.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-16">
                    <div>
                        <h2 className="font-serif text-2xl text-white mb-6">Equipment</h2>
                        <ul className="space-y-3 font-sans text-sm text-neutral-400 tracking-wide uppercase">
                            <li className="flex items-center gap-3">
                                <span className="h-1 w-1 bg-white rounded-full" />
                                Sony A7R IV
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="h-1 w-1 bg-white rounded-full" />
                                Leica Q2
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="h-1 w-1 bg-white rounded-full" />
                                FE 16-35mm F2.8 GM
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="h-1 w-1 bg-white rounded-full" />
                                FE 85mm F1.4 GM
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-serif text-2xl text-white mb-6">Contact</h2>
                        <div className="space-y-3 font-sans text-sm text-neutral-400 tracking-wide uppercase">
                            <p>For print inquiries or commissions:</p>
                            <a href="mailto:curator@obsidian.com" className="text-white hover:opacity-70 transition-opacity block mt-2">
                                curator@example.com
                            </a>
                            <div className="flex gap-6 mt-6">
                                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
