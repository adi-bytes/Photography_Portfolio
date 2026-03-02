"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InteractiveBackground() {
    const [stars, setStars] = useState<{ id: number; left: string; top: string; size: number; delay: number; duration: number }[]>([]);
    const [comets, setComets] = useState<{ id: number; top: string; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate static twinkling stars
        const newStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 0.5, // 0.5 to 2.5px
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2, // 2 to 5s twinkle
        }));
        setStars(newStars);

        // Generate shooting comets
        const newComets = Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 60}%`, // Comets usually in the upper sky
            delay: Math.random() * 15, // Staggered appearances
            duration: Math.random() * 2 + 1.5, // 1.5 to 3.5s flight time
        }));
        setComets(newComets);
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0f1d] via-[#05080e] to-black overflow-hidden pointer-events-none">
            {/* Grain/Noise Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            {/* Twinkling Stars */}
            {stars.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute rounded-full bg-white blur-[0.5px]"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Shooting Comets */}
            {comets.map((comet) => (
                <motion.div
                    key={`comet-${comet.id}`}
                    className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-white/80 to-transparent -rotate-45"
                    style={{ top: comet.top, left: "-10%" }}
                    animate={{
                        x: ['0vw', '120vw'],
                        y: ['0vh', '120vh'], // 45 degree angle matches the rotation
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: comet.duration,
                        repeat: Infinity,
                        delay: comet.delay,
                        repeatDelay: Math.random() * 10 + 5, // Wait 5-15s between shooting stars
                        ease: "linear",
                    }}
                />
            ))}

            {/* Subtle glow near the bottom to anchor the layout */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[40%] rounded-[100%] bg-blue-900/10 blur-[100px]" />
        </div>
    );
}
