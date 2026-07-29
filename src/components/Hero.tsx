"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  // Background moves slightly down
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // Text moves up slightly slower than the scroll
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Foreground moves up much faster (or stays relatively still to create depth)
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
    >
      {/* Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <Image
          src="/bg.png"
          alt="Atmospheric landscape"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Text Layer */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ y: textY }}
      >
        <h1 className="text-[15vw] font-black tracking-tighter text-white opacity-90 mix-blend-overlay">
          GHOST
        </h1>
      </motion.div>

      {/* Foreground Layer */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none"
        style={{ y: fgY }}
      >
        <div className="relative w-full h-[80vh] md:h-[90vh]">
          <Image
            src="/fg.png"
            alt="Samurai silhouette"
            fill
            className="object-contain object-bottom"
            // Invert makes the white bg black and black silhouette white.
            // Screen makes black transparent and white visible.
            style={{ filter: "invert(1)", mixBlendMode: "screen" }}
            priority
          />
        </div>
      </motion.div>

      {/* Gradient fade to transition into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] to-transparent z-30 pointer-events-none" />
    </div>
  );
}
