"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StarryBackground() {
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate random stars on mount to avoid server/client hydration mismatch
        const generateStars = () => {
            const starCount = 100; // Adjust for density
            const newStars = Array.from({ length: starCount }).map((_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 2 + 1, // 1px to 3px
                duration: Math.random() * 20 + 20, // 20s to 40s
                delay: Math.random() * 10,
            }));
            setStars(newStars);
        };
        generateStars();
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white opacity-40 mix-blend-screen"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        y: ["0%", "-100%"],
                        opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{
                        y: {
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "linear",
                        },
                        opacity: {
                            duration: star.duration / 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                        delay: star.delay,
                    }}
                />
            ))}
            {/* Gradient overlay to soften the stars near the top and bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black pointer-events-none" />
        </div>
    );
}
