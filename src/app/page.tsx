// TODO: Add smooth scrolling and scroll snap to sections for a more polished experience
// TODO: Add loading screen/animation
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Camera, Mail, Menu, X, ArrowUpRight, Crosshair, Globe, MessageCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import InfiniteMenu from '@/components/InfiniteMenu';
import InfiniteMenuLightbox from '@/components/InfiniteMenuLightbox';
import Masonry from '@/components/Masonry';
import MasonryLightbox from '@/components/MasonryLightbox';
import TextPressure from '@/components/TextPressure';
import TargetCursor from '@/components/TargetCursor';
import LoadingScreen from '@/components/LoadingScreen';

// --- Custom Hooks ---

// --- Components ---

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 /5 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#hero" className="cursor-target cursor-none flex items-center gap-2 text-white font-mono font-bold tracking-widest text-sm z-50">
            {/* <img src={process.env.NEXT_PUBLIC_URL + "/slash3.svg"} alt="///" className="w-6 h-6" /> */}
            {/* <Camera size={18} /> */}
            <span>ARTEM MELNIK</span>
          </a>
          <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-white/70">
            <a href="#masonry" className="cursor-target cursor-none hover:text-white transition-colors">WORK</a>
             <a href="#photoshop" className="cursor-target cursor-none hover:text-white transition-colors">PHOTOSHOP</a>
            <a href="#contact" className="cursor-target cursor-none hover:text-white transition-colors">CONTACT</a>
          </div>

          <button 
            className="text-white z-50 md:hidden cursor-target cursor-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <a href="#masonry" onClick={() => setMenuOpen(false)} className="cursor-target cursor-none text-3xl font-bold tracking-widest text-white font-['Anton']">WORK</a>
         <a href="#photoshop" onClick={() => setMenuOpen(false)} className="cursor-target cursor-none text-3xl font-bold tracking-widest text-white font-['Anton']">PHOTOSHOP</a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="cursor-target cursor-none text-3xl font-bold tracking-widest text-white font-['Anton']">CONTACT</a>
      </div>
    </>
  );
};

const PosterSection = ({ 
  id,
  title, 
  titleFont = 'Anton',
  bgImage, 
  fgImage,
  textColor = 'text-white',
  blendMode = 'mix-blend-overlay',
  topTextLeft,
  topTextRight,
  bottomTextLeft,
  bottomTextRight,
  sideText,
  rightSideText,
  metadata,
  titleEffect = 'pressure'
}: {
  id: string;
  title: string;
  titleFont?: string;
  bgImage: string;
  fgImage?: string;
  textColor?: string;
  blendMode?: string;
  topTextLeft: string[];
  topTextRight: string[];
  bottomTextLeft: { title: string; desc: string };
  bottomTextRight: { title: string; desc: string };
  sideText: string;
  rightSideText?: string;
  metadata: string;
  titleEffect?: 'plain' | 'pressure';
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [showOverlayText, setShowOverlayText] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Rear background moves the least to create the deepest parallax plane
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-4%", "15%"]);
  // Foreground background image moves slightly more than the rear layer
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  // Text moves up faster than the background
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);
  // Foreground moves up the fastest, creating a strong parallax
  const fgY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

useEffect(() => {
  // Adjust this duration (in milliseconds) to control when the text starts appearing
  const TEXT_ANIMATION_DELAY = 2500; 

  const timer = setTimeout(() => {
    setShowOverlayText(true);
  }, TEXT_ANIMATION_DELAY);

  return () => clearTimeout(timer);
}, []);

  return (
    <section ref={containerRef} id={id} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center snap-start snap-always">
      {/* Rear Background Image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <img 
          src={process.env.NEXT_PUBLIC_URL + "/background.png"} 
          alt="Background texture"
          className="w-full h-[120%] object-cover opacity-70 -mt-[10%]"
        />
      </motion.div>

      {/* Parallax Typography Layer */}
      <motion.div 
        className={`absolute z-10 w-full flex flex-col justify-center items-center ${blendMode} opacity-100`}
        style={{ y: textY }}
      >
        {titleEffect === 'pressure' ? (
          <div className="flex flex-col items-center justify-center w-[92vw] md:w-[86vw] pointer-events-auto gap-0">
            {/* Staggered Line 1: ARTEM */}
            <motion.div 
              className="h-[14vh] md:h-[34vh] w-full"
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ 
                y: showOverlayText ? 0 : '100vh', 
                opacity: showOverlayText ? 1 : 0 
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <TextPressure
                text="Artem"
                flex={true}
                alpha={false}
                stroke={false}
                width={false}
                weight={true}
                italic={true}
                scale={true}
                className="uppercase"
              />
            </motion.div>

            {/* Staggered Line 2: MELNIK */}
            <motion.div 
              className="h-[14vh] md:h-[34vh] w-full"
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ 
                y: showOverlayText ? 0 : '100vh', 
                opacity: showOverlayText ? 1 : 0 
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.18, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <TextPressure
                text="Melnik"
                flex={true}
                alpha={false}
                stroke={false}
                width={false}
                weight={true}
                italic={true}
                scale={true}
                className="uppercase"
              />
            </motion.div>
          </div>
        ) : (
          <h1 
            className={`text-[25vw] md:text-[22vw] leading-none tracking-tighter text-center w-full uppercase ${textColor}`}
            style={{ fontFamily: `"${titleFont}", sans-serif` }}
          >
            {title}
          </h1>
        )}
      </motion.div>

      {/* Front Background Image */}
      <div className="w-full overflow-hidden relative"> {/* Outer wrapper to catch and hide the cropped side edges */}
        <motion.div 
          className="relative h-screen w-[177.78vh] min-w-full left-1/2 -translate-x-1/2 overflow-hidden z-20" 
          style={{ y: bgY }}
        >
          {/* Background Texture */}
          <div className="z-[70]">
            <LoadingScreen
              screenSrc="/colorflow-animation-new.gif"
            />
          </div>

          {/* Main Background Image */}
          <img 
            src={process.env.NEXT_PUBLIC_URL + bgImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-100 scale-110" 
          />

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
        </motion.div>
      </div>

      {/* Foreground Image Layer (if provided) */}
      {fgImage && (
        <motion.div 
          className="absolute z-[70] w-full h-full flex justify-center items-end pointer-events-none"
          style={{ y: fgY }}
        >
        </motion.div>
      )}

      {/* Foreground tiny typography details (Poster UI) */}
      <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-12 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex justify-between items-start text-white/80 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase leading-relaxed">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : -40 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {topTextLeft.map((line: string, i: number) => <div key={i}>{line}</div>)}
          </motion.div>
          <div className="flex items-center gap-2">
            <img src={process.env.NEXT_PUBLIC_URL + "/slash3.svg"} alt="///" className="w-6 h-6" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : 40 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-right"
          >
            {topTextRight.map((line: string, i: number) => <div key={i}>{line}</div>)}
          </motion.div>
        </div>

        {/* Middle Side Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : -40 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-white/80 font-mono text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
        >
          {sideText}
        </motion.div>
        {rightSideText && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : 40 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right text-white/80 font-mono text-[10px] tracking-[0.3em] uppercase whitespace-nowrap text-right"
          >
            {rightSideText}
          </motion.div>
        )}
        {/* Bottom row */}
        <div className="flex justify-between items-end text-white/80 font-mono text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] uppercase max-w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : -40 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.16 }}
            className="max-w-[40%]"
          >
            <div className="font-bold mb-1">{bottomTextLeft.title}</div>
            <div className="opacity-70 leading-tight text-[8px] md:text-[10px]">{bottomTextLeft.desc}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : 40 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.16 }}
            className="text-right max-w-[40%]"
          >
            <div className="font-bold mb-1">{bottomTextRight.title}</div>
            <div className="opacity-70 leading-tight text-[8px] md:text-[10px]">{bottomTextRight.desc}</div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative corner markers */}
      <motion.div
        initial={{ opacity: 0, x: -12, y: -12 }}
        animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : -12, y: showOverlayText ? 0 : -12 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/30 z-20"
      />
      <motion.div
        initial={{ opacity: 0, x: 12, y: -12 }}
        animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : 12, y: showOverlayText ? 0 : -12 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/30 z-20"
      />
      <motion.div
        initial={{ opacity: 0, x: -12, y: 12 }}
        animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : -12, y: showOverlayText ? 0 : 12 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/30 z-20"
      />
      <motion.div
        initial={{ opacity: 0, x: 12, y: 12 }}
        animate={{ opacity: showOverlayText ? 1 : 0, x: showOverlayText ? 0 : 12, y: showOverlayText ? 0 : 12 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/30 z-20"
      />
    </section>
  );
};

const GallerySection = () => {
  const items = [
    {
      image: '/Portfolio%20Images/Photoshop/Hummingbird_resized.webp',
      link: 'https://example.com/echo-frame',
      title: 'Hummingbird',
      tag: 'Color Correction',
      description: 'For this piece, I wanted to incoporate a small bird into a large scene. I chose hummingbird to be my subject overlooking the moody street below. I used color correction to make the bird pop out of the scene and give it a more vibrant look, contrasting the sky with the ground below.',
    },
    {
      image: '/Portfolio%20Images/Photoshop/Isabelle%20Chess%20Photoshop_resized.webp',
      link: 'https://example.com/afterimage',
      title: 'Ascension',
      tag: 'Art Direction',
      description: 'For this work, I wanted to create a surreal scene where a chess player is floating in the air above the chess board along with the chess pieces exploding out from all around them. I used various Photoshop techniques like relighting, distortion/warping, and rotation to blend the chess piece with the background and create a sense of depth and movement.',
    },
    {
      image: '/Portfolio%20Images/Photoshop/Naveen%20F1%20Full%20Poster%20Color%20Corrected_resized.webp',
      link: 'https://example.com/signal-drift',
      title: 'Speed Drift',
      tag: 'Layout / Arrangement',
      description: 'I wanted to practice my poster design skills with this piece, so I created a poster for a friend incorporating the theme of a Formula 1 against the iconic Golden Gate Bridge background. I also incorporated their name with a nice gradient to fill the empty space in the sky and create a more dynamic composition. I also added lots of small details to the F1 car in replacement of the typical advertisments you would see on a real F1 car to make it more unique and personalized.',
    },
    {
      image: '/Portfolio%20Images/Photoshop/Picsart_24-12-25_20-21-30-540-01_resized.webp',
      link: 'https://example.com/signal-drift',
      title: 'Christmas Bunny',
      tag: 'Poster Design',
      description: 'I wanted to make a design for a postcard which you might use for Christmas, so I created a poster with a bunny in the center and a snowy background. I used various Photoshop techniques like color correction, blending, and layering to create a very nice, clean and cohesive design.',
    },
    {
      image: '/Portfolio%20Images/Photoshop/Skull Cliff_resized.webp',
      link: 'https://example.com/signal-drift',
      title: 'Skull Cliff',
      tag: 'Lighting / Composition',
      description: 'In this composition, I wanted to practice embedding an object into a more flat background, so I chose a cliff and a skull to create a more dramatic scene. I did a lot of retouching and relighting by painting on shadows and highlights onto the skull to make it look more realistic and blend into the scene better.',
    },
    {
      image: '/Portfolio%20Images/Photoshop/Waterport Edited (1)_resized.webp',
      link: 'https://example.com/signal-drift',
      title: 'Waterport',
      tag: 'Blending',
      description: 'I love putting various animals into my compositions, so I thought it would be interesting to put a few manta rays into an airport scene because they do look a bit like airplanes but in the water. I used lots of blending and masking techniques to make the manta rays fit in well with the background as well as a significant amount of image editing and color correction to make the scene look very vibrant with a very pretty grey, purple, and pink color palette from the glowing sunset.',
    },
  ];

  const [menuLightboxOpen, setMenuLightboxOpen] = React.useState(false);
  const [menuLightboxIndex, setMenuLightboxIndex] = React.useState(0);

  const handleMenuItemOpen = (index: number) => {
    setMenuLightboxIndex(index);
    setMenuLightboxOpen(true);
  };

  return (
    <section id="photoshop" className="bg-black py-20 px-0 text-white w-full">
      <div className="w-full">
        <div className="mb-12 mx-6 md:mx-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-['Anton'] text-5xl md:text-7xl tracking-wide mb-4">PHOTOSHOP WORK</h2>
            <p className="font-mono text-sm text-white/50 tracking-widest uppercase">Some of my favorite Photoshop projects</p>
          </div>
          <button onClick={() => handleMenuItemOpen(0)} className="cursor-target cursor-none flex items-center gap-2 font-mono text-xs tracking-widest hover:text-purple-400 transition-colors">
            VIEW ALL PROJECTS <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="relative h-[min(100vh,2100px)] w-full">
          <InfiniteMenu items={items} scale={1.6} onItemClick={handleMenuItemOpen} />
        </div>
        
        <div className="mt-6 flex gap-4 flex-wrap mx-6 md:mx-12">
          {items.map((it, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleMenuItemOpen(idx)}
              className="cursor-target cursor-none rounded overflow-hidden border border-white/10 p-0"
              aria-label={`Open ${it.title}`}
            >
              <img src={process.env.NEXT_PUBLIC_URL + it.image} alt={it.title} className="h-20 w-20 object-cover cursor-target cursor-none" />
            </button>
          ))}
        </div>
      </div>
      {menuLightboxOpen && (
        <InfiniteMenuLightbox
          items={items}
          startIndex={menuLightboxIndex}
          onClose={() => setMenuLightboxOpen(false)}
        />
      )}
    </section>
  );
};

const MasonrySection = () => {
  const items = [
    { id: '1', img: '/Portfolio%20Images/Photography/20230617_094103_lmc_8.4-EFFECTS_resized.webp', url: '/Portfolio%20Images/Photography/20230617_094103_lmc_8.4-EFFECTS_resized.webp', height: 600 },
    { id: '2', img: '/Portfolio%20Images/Photography/20230730_205822_lmc_8.4_resized.webp', url: '/Portfolio%20Images/Photography/20230730_205822_lmc_8.4_resized.webp', height: 600 },
    { id: '3', img: '/Portfolio%20Images/Photography/20230810_201440_lmc_8.4_resized.webp', url: '/Portfolio%20Images/Photography/20230810_201440_lmc_8.4_resized.webp', height: 600 },
    { id: '4', img: '/Portfolio%20Images/Photography/20230813_201221_lmc_8.4-EFFECTS_resized.webp', url: '/Portfolio%20Images/Photography/20230813_201221_lmc_8.4-EFFECTS_resized.webp', height: 600 },
    { id: '5', img: '/Portfolio%20Images/Photography/2024-04-08-11-04-55-997-EFFECTS_resized.webp', url: '/Portfolio%20Images/Photography/2024-04-08-11-04-55-997-EFFECTS_resized.webp', height: 600 },
    { id: '6', img: '/Portfolio%20Images/Photography/AGC_20250710_192207751_resized.webp', url: '/Portfolio%20Images/Photography/AGC_20250710_192207751_resized.webp', height: 980 },
    { id: '7', img: '/Portfolio%20Images/Photography/LA_photo_resized.webp', url: '/Portfolio%20Images/Photography/LA_photo_resized.webp', height: 600 },
    { id: '8', img: '/Portfolio%20Images/Photography/Beach_resized.webp', url: '/Portfolio%20Images/Photography/Beach_resized.webp', height: 520 },
    { id: '9', img: '/Portfolio%20Images/Photography/Bee%20In%20Tree_resized.webp', url: '/Portfolio%20Images/Photography/Bee%20In%20Tree_resized.webp', height: 540 },
    { id: '10', img: '/Portfolio%20Images/Photography/Crane_resized.webp', url: '/Portfolio%20Images/Photography/Crane_resized.webp', height: 540 },
    { id: '11', img: '/Portfolio%20Images/Photography/Leaves_resized.webp', url: '/Portfolio%20Images/Photography/Leaves_resized.webp', height: 600 },
    { id: '12', img: '/Portfolio%20Images/Photography/P1036154_resized.webp', url: '/Portfolio%20Images/Photography/P1036154_resized.webp', height: 540 },
    { id: '13', img: '/Portfolio%20Images/Photography/P1036155_resized.webp', url: '/Portfolio%20Images/Photography/P1036155_resized.webp', height: 540 },
    { id: '14', img: '/Portfolio%20Images/Photography/P1036156_resized.webp', url: '/Portfolio%20Images/Photography/P1036156_resized.webp', height: 540 },
    { id: '15', img: '/Portfolio%20Images/Photography/P1036227_resized.webp', url: '/Portfolio%20Images/Photography/P1036227_resized.webp', height: 540 },
    { id: '16', img: '/Portfolio%20Images/Photography/P1039112_resized.webp', url: '/Portfolio%20Images/Photography/P1039112_resized.webp', height: 540 },
    { id: '17', img: '/Portfolio%20Images/Photography/P1044242-01_resized.webp', url: '/Portfolio%20Images/Photography/P1044242-01_resized.webp', height: 540 },
    { id: '18', img: '/Portfolio%20Images/Photography/P1044460-01_resized.webp', url: '/Portfolio%20Images/Photography/P1044460-01_resized.webp', height: 540 },
    { id: '19', img: '/Portfolio%20Images/Photography/Paragliding_resized.webp', url: '/Portfolio%20Images/Photography/Paragliding_resized.webp', height: 520 },
    { id: '20', img: '/Portfolio%20Images/Photography/Rock_resized.webp', url: '/Portfolio%20Images/Photography/Rock_resized.webp', height: 550 },
    { id: '21', img: '/Portfolio%20Images/Photography/Rose%20Stripes_resized.webp', url: '/Portfolio%20Images/Photography/Rose%20Stripes_resized.webp', height: 600 },
    { id: '22', img: '/Portfolio%20Images/Photography/Waves_resized.webp', url: '/Portfolio%20Images/Photography/Waves_resized.webp', height: 600 },
  ];

  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="masonry" className="bg-[#050505] py-40 md:py-48 px-6 md:px-12 text-white border-y border-white/10 snap-start snap-always">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-['Anton'] text-5xl md:text-7xl tracking-wide mb-4">PHOTOGRAPHY</h2>
            <p className="font-mono text-sm text-white/50 tracking-widest uppercase">A collection of my latest photographs</p>
          </div>
          <button onClick={() => setLightboxOpen(true)} className="cursor-target cursor-none flex items-center gap-2 font-mono text-xs tracking-widest hover:text-purple-400 transition-colors">
            OPEN ARCHIVE <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="relative min-h-[2200px] w-full">
          <Masonry
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={handleItemClick}
          />
        </div>
      </div>
      {lightboxOpen && (
        <MasonryLightbox items={items} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="max-w-2xl">
            <h2 className="font-['Anton'] text-6xl md:text-8xl tracking-tight mb-8 leading-none">LET&apos;S CREATE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">SOMETHING</span></h2>
            <p className="font-mono text-sm text-white/50 tracking-widest leading-loose uppercase">
                Experienced in Photoshop, Photography, and Digital Design.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 font-mono text-sm tracking-widest">
            <a href="https://mail.google.com/mail/u/0/?to=artem_melnik@proton.me&tf=cm" className="cursor-target cursor-none flex items-center gap-4 hover:text-purple-400 transition-colors">
              <Mail size={18} /> ARTEM_MELNIK@PROTON.ME
            </a>
            <a href="#" className="cursor-target cursor-none flex items-center gap-4 hover:text-purple-400 transition-colors">
              <MessageCircle size={18} /> ARTEM MELNIK
            </a>
            <a href="#" className="cursor-target cursor-none flex items-center gap-4 hover:text-purple-400 transition-colors">
              <Globe size={18} /> ARTEM-MELNIK.GITHUB.IO
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 font-mono text-[10px] text-white/40 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} ARTEM MELNIK. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 md:mt-0">DESIGNED IN CALIFORNIA</p>
        </div>
      </div>
    </footer>
  );
};


// --- Main Application ---

export default function Home() {
  // Inject Google Fonts and Setup Inertial Smooth Scrolling via Lenis
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,700;1,700&family=JetBrains+Mono:wght@100..800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Initialize Lenis with precise physics configurations
    const lenis = new Lenis({
      duration: 1.1,      // Speed of deceleration animation (lower is snappier)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Clean exponential curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95, // Keeps acceleration light and non-clunky
    });

    // Frame update loop for linear calculation handling
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    document.body.style.backgroundColor = '#000';
    
    return () => {
      document.head.removeChild(link);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-black min-h-screen selection:bg-purple-500 selection:text-white">
      {/* Global CSS overrides */}
      <style>{`
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* High-end snapping and acceleration properties applied at layout level */
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: auto !important;
        }

        /* Hide scrollbar for cleaner look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      <NavBar />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />

      <main className="w-full overflow-x-hidden">
        
        {/* POSTER 1: GHOST STYLE */}
        <PosterSection
          id="hero"
          title="Artem Melnik"
          titleFont="Anton"
          titleEffect="pressure"
          blendMode="mix-blend-normal"
          textColor="text-white drop-shadow-2xl"
          bgImage="/flowers-sky.png"
          // fgImage="/tv-frame.png"
          metadata="1185"
          topTextLeft={["RESTRUCTURING", "PIXELS"]}
          topTextRight={["ADJUSTING", "HUES"]}
          sideText="DESIGNED BY ARTEM MELNIK"
          rightSideText="DESIGNED BY ARTEM MELNIK"
          bottomTextLeft={{
            title: "CRAFTING IN RGB",
            desc: "WARPING SURFACES AND STAMPING TEXTURES UNTIL FABRICATED SCENES FEEL INDISTINGUISHABLE FROM REALITY."
          }}
          bottomTextRight={{
            title: "BENDING WAVELENGTHS",
            desc: "RAW VISUAL DATA IS BENT AND REFINED UNTIL ABSOLUTE BALANCE IS ACHIEVED."
          }}
        />

        <MasonrySection />

        <div className="snap-start snap-always">
          <GallerySection />
          <Footer />
        </div>
        
      </main>
    </div>
  );
}