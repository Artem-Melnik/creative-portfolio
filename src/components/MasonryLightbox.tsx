"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { gsap } from "gsap";

interface Item {
  id: string;
  img: string;
  url: string;
  height: number;
}

interface Props {
  items: Item[];
  startIndex: number;
  onClose: () => void;
}

export default function MasonryLightbox({ items, startIndex, onClose }: Props) {
  const [index, setIndex] = React.useState(startIndex || 0);
  const len = items.length;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isAnimating = useRef(false);
  const preloadCache = useRef<Record<string, HTMLImageElement>>({});
  const indexRef = useRef<number>(index);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const animateToIndex = (target: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const imgEl = imgRef.current;
    const tl = gsap.timeline({ onComplete: () => (isAnimating.current = false) });
    if (imgEl) {
      tl.to(imgEl, { opacity: 0, scale: 0.98, duration: 0.18, ease: 'power2.in' });
      tl.add(() => { setIndex(target); indexRef.current = target; });
      tl.fromTo(imgEl, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
    } else {
      setIndex(target);
      indexRef.current = target;
      isAnimating.current = false;
    }
  };

  // keep ref in sync with state
  React.useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const handleNext = () => animateToIndex((indexRef.current + 1) % len);
  const handlePrev = () => animateToIndex((indexRef.current - 1 + len) % len);

  const handleCloseRequest = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; onClose(); } });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 0);
    tl.to(contentRef.current, { scale: 0.98, opacity: 0, duration: 0.28, ease: 'power3.in' }, 0);
  };

  useEffect(() => {
    // open animation
    const tl = gsap.timeline();
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
    if (contentRef.current) gsap.set(contentRef.current, { scale: 0.98, opacity: 0 });
    tl.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0);
    tl.to(contentRef.current, { scale: 1, opacity: 1, duration: 0.42, ease: 'power3.out' }, 0.05);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRequest();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  // Preload all images when the lightbox mounts to make switching snappier
  useEffect(() => {
    items.forEach((it) => {
      const url = it.img;
      if (!preloadCache.current[url]) {
        const p = new Image();
        p.src = url;
        // Attempt eager decoding when supported
        try {
          // @ts-ignore
          if ('decoding' in p) p.decoding = 'async';
        } catch (e) {
          /* ignore */
        }
        preloadCache.current[url] = p;
      }
    });
  }, [items]);

  // Also ensure adjacent images are prioritized when the index changes
  useEffect(() => {
    if (!items.length) return;
    const next = items[(index + 1) % len]?.img;
    const prev = items[(index - 1 + len) % len]?.img;
    [next, prev].forEach((url) => {
      if (url && !preloadCache.current[url]) {
        const p = new Image();
        p.src = url;
        preloadCache.current[url] = p;
      }
    });
  }, [index, items, len]);

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center cursor-none">
      <div ref={overlayRef} className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-none" onClick={handleCloseRequest} />

      <div ref={contentRef} className="relative z-10 max-w-[90vw] max-h-[90vh] w-full flex flex-col items-center">
        <button onClick={handleCloseRequest} className="cursor-target cursor-none absolute top-6 right-6 z-20 rounded-full bg-black/50 p-2" aria-label="Close lightbox">
          <X size={20} />
        </button>

        <div className="relative w-full flex items-center justify-center">
          <button onClick={handlePrev} className="absolute left-0 ml-2 z-20 rounded-full bg-black/40 p-3 cursor-target cursor-none" aria-label="Previous image">
            <ArrowLeft size={24} />
          </button>

          <div className="cursor-none">
            <img
              ref={imgRef}
              src={process.env.NEXT_PUBLIC_URL + items[index].img}
              alt={`Image ${index + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded cursor-none"
            />
          </div>

          <button onClick={handleNext} className="absolute right-0 mr-2 z-20 rounded-full bg-black/40 p-3 cursor-target cursor-none" aria-label="Next image">
            <ArrowRight size={24} />
          </button>
        </div>

        <div className="mt-6 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-3 justify-center">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => animateToIndex(i)}
                className={`flex-shrink-0 rounded overflow-hidden border transition-all duration-200 ${
                  i === index ? 'border-white scale-105' : 'border-white/20 hover:border-white/50'
                } cursor-target cursor-none`}
                aria-label={`Preview ${i + 1}`}
              >
                <img src={process.env.NEXT_PUBLIC_URL + it.img} alt={`Preview ${i + 1}`} className="h-20 w-20 object-cover cursor-target cursor-none" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
