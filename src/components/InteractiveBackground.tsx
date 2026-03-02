"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InteractiveBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    // We'll create a subtle grid and a glowing orb that follows the mouse
    return (
        <div className="fixed inset-0 z-0 bg-neutral-950 overflow-hidden pointer-events-none">
            {/* Grain/Noise Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            {/* Abstract ambient gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-800/20 blur-[120px]" />

            {/* Mouse-following Spotlight/Orb */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] -translate-x-1/2 -translate-y-1/2"
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                }}
                transition={{
                    type: "tween",
                    ease: "backOut",
                    duration: 0.5,
                }}
            />

            {/* A subtle grid pattern that stays static, providing contrast to the moving glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>
    );
}
