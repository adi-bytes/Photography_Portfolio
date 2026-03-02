"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function NavBar() {
    const pathname = usePathname();

    // Do not show the navigation bar on admin routes
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/40 backdrop-blur-md border-b border-white/10">
            <Link href="/" className="font-serif text-2xl text-white tracking-widest hover:opacity-80 transition-opacity">
                OBSIDIAN
            </Link>

            <div className="flex gap-8 font-sans text-xs uppercase tracking-[0.2em]">
                <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                    Gallery
                    {pathname === '/' && (
                        <motion.div layoutId="nav-indicator" className="h-[1px] w-full bg-white mt-1" />
                    )}
                </Link>
                <Link href="/about" className={`transition-colors ${pathname === '/about' ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                    Information
                    {pathname === '/about' && (
                        <motion.div layoutId="nav-indicator" className="h-[1px] w-full bg-white mt-1" />
                    )}
                </Link>
            </div>
        </nav>
    );
}
