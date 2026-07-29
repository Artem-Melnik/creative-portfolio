"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { gsap } from "gsap";

interface MenuItem {
  image: string;
  link: string;
  title: string;
  tag: string;
  description: string;
}

interface Props {
  items: MenuItem[];
  startIndex: number;
  onClose: () => void;
}

export default function InfiniteMenuLightbox({ items, startIndex, onClose }: Props) {
  const [index, setIndex] = React.useState(startIndex || 0);
  const len = items.length;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isAnimating = useRef(false);
  const indexRef = useRef<number>(index);
  const preloadCache = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const animateToIndex = (target: number) => {
    if (isAnimating.current || !len) return;
    isAnimating.current = true;

    const imgEl = imgRef.current;
    const tl = gsap.timeline({ onComplete: () => (isAnimating.current = false) });

    if (imgEl) {
      tl.to(imgEl, { opacity: 0, y: 10, scale: 0.985, duration: 0.18, ease: "power2.in" });
      tl.add(() => {
        setIndex(target);
        indexRef.current = target;
      });
      tl.fromTo(imgEl, { opacity: 0, y: -10, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" });
    } else {
      setIndex(target);
      indexRef.current = target;
      isAnimating.current = false;
    }
  };

  const handleNext = () => animateToIndex((indexRef.current + 1) % len);
  const handlePrev = () => animateToIndex((indexRef.current - 1 + len) % len);

  const handleCloseRequest = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({ onComplete: () => {
      isAnimating.current = false;
      onClose();
    }});

    tl.to(overlayRef.current, { opacity: 0, duration: 0.24, ease: "power2.in" }, 0);
    tl.to(contentRef.current, { scale: 0.98, opacity: 0, duration: 0.28, ease: "power3.in" }, 0);
  };

  useEffect(() => {
    const tl = gsap.timeline();
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
    if (contentRef.current) gsap.set(contentRef.current, { scale: 0.98, opacity: 0 });
    tl.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0);
    tl.to(contentRef.current, { scale: 1, opacity: 1, duration: 0.42, ease: "power3.out" }, 0.05);

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

  useEffect(() => {
    items.forEach((it) => {
      const url = it.image;
      if (!preloadCache.current[url]) {
        const p = new Image();
        p.src = url;
        preloadCache.current[url] = p;
      }
    });
  }, [items]);

  useEffect(() => {
    if (!items.length) return;
    const next = items[(index + 1) % len]?.image;
    const prev = items[(index - 1 + len) % len]?.image;
    [next, prev].forEach((url) => {
      if (url && !preloadCache.current[url]) {
        const p = new Image();
        p.src = url;
        preloadCache.current[url] = p;
      }
    });
  }, [index, items, len]);

  const activeItem = items[index];

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center cursor-none">
      <div ref={overlayRef} className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-none" onClick={handleCloseRequest} />

      <div ref={contentRef} className="relative z-10 w-[min(92vw,1400px)] max-h-[92vh] overflow-y-auto overscroll-contain touch-pan-y rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 md:p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <button onClick={handleCloseRequest} className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/50 p-2 text-white cursor-target cursor-none" aria-label="Close lightbox">
          <X size={20} />
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] items-stretch">
          <div className="relative min-h-[24rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.55))]" />

            <button onClick={handlePrev} className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/45 p-3 text-white cursor-target cursor-none" aria-label="Previous work">
              <ArrowLeft size={22} />
            </button>

            <button onClick={handleNext} className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/45 p-3 text-white cursor-target cursor-none" aria-label="Next work">
              <ArrowRight size={22} />
            </button>

            <div className="relative flex h-full min-h-[24rem] items-center justify-center p-6 md:p-10">
              <img
                ref={imgRef}
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-black/35 px-5 py-4 backdrop-blur-md">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/45">Selected Work</p>
                <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">{activeItem.title}</h3>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                {index + 1} / {len}
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-5 rounded-[1.5rem] border border-white/10 bg-black/35 p-5 md:p-6">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.36em] text-white/45">Project Notes</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{activeItem.title}</h2>
              {/* <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">{activeItem.link.replace(/^https?:\/\//, "")}</p> */}
              <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">{activeItem.tag}</p>
            </div>

            <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">Description</p>
              <p className="text-sm leading-7 text-white/68">
                {activeItem.description || "No project notes are available for this work yet."}
              </p>
            </div>

            {/* <button
              type="button"
              onClick={() => window.open(activeItem.link, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              View Image
              <ExternalLink size={16} />
            </button> */}
          </aside>
        </div>
      </div>
    </div>
  );
}