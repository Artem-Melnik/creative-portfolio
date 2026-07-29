"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let&apos;s Create Together</h2>
        <p className="text-zinc-400">Available for freelance opportunities and collaborations.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-4 rounded-lg hover:bg-accent/90 transition-colors group">
              <span>Send Message</span>
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col justify-center space-y-12"
        >
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="text-accent" /> Location
            </h3>
            <p className="text-zinc-400 text-lg">Neo-Tokyo / Remote Worldwide</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Mail className="text-accent" /> Email
            </h3>
            <p className="text-zinc-400 text-lg">hello@portfolio.com</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Socials</h3>
            <div className="flex gap-4">
              <a href="#" className="px-6 py-3 bg-zinc-900 rounded-full hover:bg-accent hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="px-6 py-3 bg-zinc-900 rounded-full hover:bg-accent hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
