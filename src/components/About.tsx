"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-32 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 aspect-square bg-zinc-900 rounded-full overflow-hidden relative"
        >
          {/* Abstract placeholder for author profile picture */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-black mix-blend-screen" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-zinc-800 font-bold text-9xl">A</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h2 className="text-4xl font-bold tracking-tight">The Vision</h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            I specialize in crafting digital experiences that transcend the ordinary. 
            Blending high-end photography, 3D elements, and advanced Photoshop techniques, 
            I create artwork that tells a story of atmosphere, emotion, and striking visual depth.
          </p>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Based in the neon-lit streets and digital realms, I am always seeking the 
            next visual boundary to push.
          </p>
          
          <button className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-accent hover:text-white transition-colors duration-300">
            View Resume
          </button>
        </motion.div>
      </div>
    </section>
  );
}
