"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { mat4, vec3 } from "gl-matrix";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  image: string;
  link: string;
  title: string;
  description: string;
};

const defaultItems: MenuItem[] = [
  {
    image: "https://picsum.photos/900/900?grayscale",
    link: "https://google.com/",
    title: "Item 1",
    description: "This is pretty cool, right?",
  },
];

export interface InfiniteMenuProps {
  items?: MenuItem[];
  scale?: number;
}

export default function InfiniteMenu({ items = [], scale = 1 }: InfiniteMenuProps) {
  const menuItems = items.length ? items : defaultItems;
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const itemCount = menuItems.length;
  const orbitRadius = 165 * scale;
  const stepAngle = 360 / itemCount;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
      setIsMoving(true);
      window.setTimeout(() => setIsMoving(false), 450);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [itemCount, shouldReduceMotion]);

  const orbitalItems = useMemo(() => {
    const rotationMatrix = mat4.create();
    mat4.fromZRotation(rotationMatrix, ((activeIndex * stepAngle) * Math.PI) / 180 * -1);

    return menuItems.map((item, index) => {
      const theta = ((index * stepAngle - 90) * Math.PI) / 180;
      const local = vec3.fromValues(Math.cos(theta) * orbitRadius, Math.sin(theta) * orbitRadius, 0);
      const world = vec3.transformMat4(vec3.create(), local, rotationMatrix);
      const zDepth = Math.cos(((index - activeIndex) * stepAngle * Math.PI) / 180);

      return {
        ...item,
        x: world[0],
        y: world[1],
        depth: zDepth,
      };
    });
  }, [activeIndex, menuItems, orbitRadius, stepAngle]);

  const activeItem = menuItems[activeIndex];

  const goToNext = () => {
    setIsMoving(true);
    setActiveIndex((current) => (current + 1) % itemCount);
    window.setTimeout(() => setIsMoving(false), 450);
  };

  const goToPrevious = () => {
    setIsMoving(true);
    setActiveIndex((current) => (current - 1 + itemCount) % itemCount);
    window.setTimeout(() => setIsMoving(false), 450);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) < 20) return;
    if (info.offset.x < 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

      <div className="relative grid h-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="relative min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#050505]"
          onWheel={handleWheel}
          role="presentation"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.16),transparent_52%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.75))]" />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-[50%] sm:h-[32rem] sm:w-[32rem]"
            drag="x"
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            animate={shouldReduceMotion ? undefined : { rotate: activeIndex * stepAngle * -1 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          >
            <div className="absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.06),transparent_32%),radial-gradient(circle_at_center,rgba(0,0,0,0),rgba(0,0,0,0.64))] shadow-[0_0_120px_rgba(139,92,246,0.12)]" />

            {orbitalItems.map((item, index) => {
              const isActive = index === activeIndex;
              const distance = Math.min(Math.abs(index - activeIndex), itemCount - Math.abs(index - activeIndex));
              const opacity = isActive ? 1 : Math.max(0.35, 1 - distance * 0.15);
              const scaleFactor = isActive ? 1.08 : 0.78;

              return (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/15 bg-zinc-900 shadow-[0_18px_40px_rgba(0,0,0,0.45)] outline-none ring-0"
                  animate={
                    shouldReduceMotion
                      ? { x: item.x, y: item.y, scale: scaleFactor, opacity }
                      : { x: item.x, y: item.y, scale: scaleFactor, opacity, rotate: activeIndex * stepAngle }
                  }
                  transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.65 }}
                  whileHover={{ scale: isActive ? 1.12 : 0.9 }}
                >
                  <img src={process.env.PUBLIC_URL + item.image} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent,rgba(0,0,0,0.42))]" />
                </motion.button>
              );
            })}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.title}
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 flex h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-[48%] items-center justify-center"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
                  <img src={process.env.PUBLIC_URL + activeItem.image} alt={activeItem.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent,rgba(0,0,0,0.06)_35%,rgba(0,0,0,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-center">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.38em] text-white/55">
                      {activeItem.description}
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{activeItem.title}</h3>
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
          </motion.div>
        </div>

        <aside className="flex flex-col justify-between gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.36em] text-white/45">Infinite Menu</p>
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
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Selected</p>
                <p className="mt-2 text-xl font-semibold text-white">{activeItem.title}</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
                {activeIndex + 1}/{itemCount}
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
            {menuItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-2xl border px-3 py-4 text-left transition ${
                  index === activeIndex
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-transparent text-white/45 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <span className="block font-mono text-[9px] tracking-[0.36em] text-white/35">0{index + 1}</span>
                <span className="mt-2 block text-[11px] leading-5 tracking-[0.18em]">{item.title}</span>
              </button>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
            Hover, scroll, or drag to orbit the archive.
            <span className={isMoving ? "ml-2 text-white/60" : "ml-2 text-white/30"}>
              {isMoving ? "Moving" : "Idle"}
            </span>
          </p>
        </aside>
      </div>
    </div>
  );
}