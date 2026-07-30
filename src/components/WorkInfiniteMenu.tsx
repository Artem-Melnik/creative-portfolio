"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WorkItem = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  link: string;
  accent: string;
};

const workItems: WorkItem[] = [
  {
    id: 1,
    title: "Neon Void",
    category: "Motion / Identity",
    year: "2026",
    description: "A campaign system built around luminous gradients, motion blur, and editorial contrast.",
    image: "/Portfolio%20Images/Photography/P1036154.webp",
    link: "https://example.com/neon-void",
    accent: "from-fuchsia-500/70 to-amber-300/70",
  },
  {
    id: 2,
    title: "Echo Frame",
    category: "Brand / Visual",
    year: "2025",
    description: "A visual language for a studio launch, tuned for tactile surfaces and minimal type.",
    image: "/Portfolio%20Images/Photography/P1036155.webp",
    link: "https://example.com/echo-frame",
    accent: "from-cyan-400/70 to-blue-500/70",
  },
  {
    id: 3,
    title: "Afterimage",
    category: "Art Direction",
    year: "2025",
    description: "A moody, layered composition system for a release rollout and social-first assets.",
    image: "/Portfolio%20Images/Photography/P1036156.webp",
    link: "https://example.com/afterimage",
    accent: "from-emerald-400/70 to-lime-300/70",
  },
  {
    id: 4,
    title: "Signal Drift",
    category: "Interactive / Web",
    year: "2024",
    description: "An experimental landing page with a restless grid, mixed media, and kinetic overlays.",
    image: "/Portfolio%20Images/Photography/P1036227.webp",
    link: "https://example.com/signal-drift",
    accent: "from-orange-400/70 to-rose-500/70",
  },
  {
    id: 5,
    title: "Static Bloom",
    category: "Campaign / Launch",
    year: "2024",
    description: "A high-contrast product story with a soft, cinematic image system and sharper pacing.",
    image: "/Portfolio%20Images/Photography/P1039112.webp",
    link: "https://example.com/static-bloom",
    accent: "from-violet-400/70 to-pink-500/70",
  },
  {
    id: 6,
    title: "Northstar",
    category: "Editorial / Portfolio",
    year: "2023",
    description: "A refined archive of image-led case studies, built to breathe at every viewport.",
    image: "/Portfolio%20Images/Photography/P1044242-01.webp",
    link: "https://example.com/northstar",
    accent: "from-sky-400/70 to-indigo-500/70",
  },
];

export default function WorkInfiniteMenu() {
  const [rotationStep, setRotationStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const itemCount = workItems.length;
  const stepAngle = 360 / itemCount;
  const radius = 210;

  const activeIndex = useMemo(() => {
    return ((rotationStep % itemCount) + itemCount) % itemCount;
  }, [rotationStep, itemCount]);

  const activeItem = workItems[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      if (!isHovering) {
        setRotationStep((current) => current + 1);
      }
    }, 3600);

    return () => window.clearInterval(interval);
  }, [isHovering, shouldReduceMotion]);

  const goToNext = () => setRotationStep((current) => current + 1);
  const goToPrevious = () => setRotationStep((current) => current - 1);

  const handleItemClick = (index: number) => {
    setRotationStep(index);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragStartX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX === null) {
      return;
    }

    const deltaX = event.clientX - dragStartX;
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setDragStartX(null);
  };

  const activeScale = shouldReduceMotion ? 1 : 1.08;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

      <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className="relative min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#050505]"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setDragStartX(null)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_36%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.75))]" />

          <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-[46%] sm:h-[32rem] sm:w-[32rem]">
            <motion.div
              className="absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.05),transparent_32%),radial-gradient(circle_at_center,rgba(0,0,0,0),rgba(0,0,0,0.62))] shadow-[0_0_120px_rgba(139,92,246,0.12)]"
              animate={shouldReduceMotion ? undefined : { rotate: rotationStep * stepAngle * -1 }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
            />

            {workItems.map((item, index) => {
              const absoluteAngle = (index * stepAngle - rotationStep * stepAngle - 90) * (Math.PI / 180);
              const x = Math.cos(absoluteAngle) * radius;
              const y = Math.sin(absoluteAngle) * radius;
              const distance = Math.min(Math.abs(index - activeIndex), itemCount - Math.abs(index - activeIndex));
              const isActive = index === activeIndex;
              const scale = isActive ? activeScale : 0.78;
              const opacity = isActive ? 1 : Math.max(0.3, 1 - distance * 0.15);

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(index)}
                  className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/15 bg-zinc-900 shadow-[0_18px_40px_rgba(0,0,0,0.45)] outline-none ring-0"
                  animate={
                    shouldReduceMotion
                      ? { x, y, scale, opacity }
                      : { x, y, scale, opacity, rotate: rotationStep * stepAngle }
                  }
                  transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.65 }}
                  whileHover={{ scale: isActive ? activeScale + 0.03 : 0.9 }}
                >
                  <img
                    src={process.env.PUBLIC_URL + item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-55 mix-blend-screen`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent,rgba(0,0,0,0.42))]" />
                </motion.button>
              );
            })}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 flex h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-[48%] items-center justify-center"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
                  <img
                    src={process.env.PUBLIC_URL + activeItem.image}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent,rgba(0,0,0,0.08)_35%,rgba(0,0,0,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-center">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.38em] text-white/55">
                      {activeItem.category}
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                      {activeItem.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-1/2 top-[78%] z-20 -translate-x-[4.25rem] rounded-full border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              aria-label="Previous project"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute left-1/2 top-[78%] z-20 translate-x-[2.75rem] rounded-full border border-white/10 bg-[#6d28d9] p-4 text-white shadow-[0_18px_50px_rgba(109,40,217,0.4)] transition hover:scale-105"
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <aside className="flex flex-col justify-between gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.36em] text-white/45">
              Infinite Menu
            </p>
            <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Orbit through selected work without leaving the stage.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/60 md:text-base">
              The selected project stays centered while the surrounding archive keeps moving, so the work page feels alive even before a click.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                  Selected
                </p>
                <p className="mt-2 text-xl font-semibold text-white">{activeItem.title}</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
                {activeItem.year}
              </div>
            </div>

            <p className="text-sm leading-7 text-white/65">{activeItem.description}</p>

            <button
              type="button"
              onClick={() => window.open(activeItem.link, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              View Project
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.24em] text-white/40 sm:grid-cols-3">
            {workItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(index)}
                className={`rounded-2xl border px-3 py-4 text-left transition ${
                  index === activeIndex
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-transparent text-white/45 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <span className="block font-mono text-[9px] tracking-[0.36em] text-white/35">0{item.id}</span>
                <span className="mt-2 block text-[11px] leading-5 tracking-[0.18em]">{item.title}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}