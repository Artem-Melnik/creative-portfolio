"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const portfolioItems = [
  { id: 1, title: "Urban Shadows", category: "Street", height: "h-96", color: "bg-zinc-800" },
  { id: 2, title: "Neon Nights", category: "Cyberpunk", height: "h-[30rem]", color: "bg-indigo-950" },
  { id: 3, title: "Ethereal Landscapes", category: "Nature", height: "h-80", color: "bg-purple-900" },
  { id: 4, title: "Silent Portraits", category: "Portrait", height: "h-[28rem]", color: "bg-slate-800" },
  { id: 5, title: "Abstract Light", category: "Experimental", height: "h-96", color: "bg-violet-950" },
  { id: 6, title: "Monochrome", category: "Fine Art", height: "h-[32rem]", color: "bg-zinc-900" },
];

export default function PortfolioGrid() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Selected Works</h2>
        <p className="text-zinc-400 max-w-2xl text-lg">
          A collection of moments captured in time, exploring the boundary between reality and imagination.
        </p>
      </motion.div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className={`relative rounded-xl overflow-hidden cursor-pointer w-full inline-block ${item.height} ${item.color}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            whileHover={{ scale: 0.98 }}
          >
            {/* Placeholder for actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 flex flex-col justify-end p-8"
            >
              <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">
                {item.category}
              </p>
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
