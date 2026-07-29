"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

// Precision-tuned screen coordinate boxes for the Junost-402B frame asset
const SCREEN = {
  left:   0.118,  
  top:    0.145,  
  width:  0.612,  
  height: 0.695,  
};

interface LoadingScreenProps {
  onComplete?: () => void;
  screenSrc?: string; 
}

export default function LoadingScreen({ onComplete, screenSrc = "/your-custom-screen.jpg" }: LoadingScreenProps) {
  const loaderRef    = useRef<HTMLDivElement>(null);
  const tvWrapRef    = useRef<HTMLDivElement>(null);
  const innerWrapRef = useRef<HTMLDivElement>(null); 
  const screenRef    = useRef<HTMLImageElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const animRef      = useRef<number | null>(null);
  const [animationEnded, setAnimationEnded] = useState(false);

  const positionScreenElements = useCallback(() => {
    const img    = imgRef.current;
    const screen = screenRef.current;
    const text   = textRef.current;
    if (!img) return;

    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (!w || !h) return; 

    const sl = w * SCREEN.left;
    const st = h * SCREEN.top;
    const sw = w * SCREEN.width;
    const sh = h * SCREEN.height;

    if (screen) {
      screen.style.left   = `${sl}px`;
      screen.style.top    = `${st}px`;
      screen.style.width  = `${sw}px`;
      screen.style.height = `${sh}px`;
    }

    if (text) {
      text.style.left   = `${sl}px`;
      text.style.top    = `${st}px`;
      text.style.width  = `${sw}px`;
      text.style.height = `${sh}px`;
    }
  }, []);

  useEffect(() => {
    const PHASE = {
      hold:     { start: 0,    end: 100  },
      tvAppear: { start: 100,  end: 200 }, 
      zoomOut:  { start: 200,  end: 3000 },
      glitch:   { start: 3000, end: 3200 },
      settle:   { start: 3200, end: 3300 },
      imageOn:  { start: 3300, end: 3400 }, 
      bgFade:   { start: 3400, end: 3600 },
    };

    const easeOut   = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -18 * t);
    const easeInOut = (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 32 * t - 16) / 2 : (2 - Math.pow(2, -32 * t + 16)) / 2;
    const clamp     = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const prog      = (el: number, p: { start: number; end: number }) => clamp((el - p.start) / (p.end - p.start), 0, 1);

    let glitching = false;
    const t0 = performance.now();

    const tick = (now: number) => {
      const el        = now - t0;
      const loader    = loaderRef.current;
      const text      = textRef.current;
      const tvWrap    = tvWrapRef.current;
      const innerWrap = innerWrapRef.current;
      const screen    = screenRef.current;
      
      if (!loader || !text || !tvWrap || !innerWrap || !screen) return;

      const pTV     = easeOut(prog(el, PHASE.tvAppear));
      const pZoom   = easeInOut(prog(el, PHASE.zoomOut));
      const pSettle = easeOut(prog(el, PHASE.settle));
      const pImage  = prog(el, PHASE.imageOn);
      const pBg     = prog(el, PHASE.bgFade);

      const currentProgress = Math.max(pZoom, pSettle);
      const scale = 7 - 6.63 * currentProgress; 
      const rotation = -10.65 * pZoom;

      /* 
        CALCULATED COORDINATES FOR (1044, 536) ON A 1920x1080 CANVAS:
        - X target: 1044 / 1920 = 54.375% -> Shift from center = +4.375%
        - Y target:  536 / 1080 = 49.629% -> Shift from center = -0.371%
      */
      const translateX = 6.5 * pZoom;
      const translateY = -3.5 * pZoom;

      tvWrap.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale}) rotate(${rotation}deg)`;

      // Viewport centering shift during initial zoom out phase
      const shiftX = 7.6 * (1 - pZoom);
      const shiftY = 0.75 * (1 - pZoom);
      innerWrap.style.transform = `translate(${shiftX}%, ${shiftY}%)`;

      // const baseGray  = Math.round(255 * (1 - pTV * 0.15));
      const bgAlpha   = pBg > 0 ? 1 - pBg : 1;
      // loader.style.background = `rgba(${baseGray},${baseGray},${baseGray},${bgAlpha})`;
      loader.style.background = `rgba(255, 255, 255, ${bgAlpha})`;

      if (el >= PHASE.glitch.start && el < PHASE.glitch.end && !glitching) {
        glitching = true;
        text.classList.add('sv-glitch');
      }
      if (el >= PHASE.settle.start) {
        if (glitching) { glitching = false; text.classList.remove('sv-glitch'); }
        text.style.opacity = String(Math.max(0, 1 - prog(el, PHASE.settle)));
      }

      screen.style.opacity = String(Math.min(1, pImage * 2));

      if (el >= PHASE.bgFade.end) {
        loader.style.background = 'transparent';
        loader.style.pointerEvents = 'none';
        if (text) text.style.display = 'none';
        onComplete?.();
        setAnimationEnded(true);
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [onComplete]);

  useLayoutEffect(() => {
    positionScreenElements();
    window.addEventListener('resize', positionScreenElements);
    return () => window.removeEventListener('resize', positionScreenElements);
  }, [positionScreenElements]);

  return (
    <>
    <style>{`
      @keyframes sv-glitch {
        0%   { clip-path: inset(30% 0 60% 0); transform: translateX(-4px); color:#f00; }
        20%  { clip-path: inset(70% 0 5%  0); transform: translateX(4px);  color:#0ff; }
        40%  { clip-path: inset(10% 0 80% 0); transform: translateX(-2px); color:#fff; }
        60%  { clip-path: inset(50% 0 30% 0); transform: translateX(3px);  color:#f0f; }
        80%  { clip-path: inset(85% 0 5%  0); transform: translateX(-3px); color:#ff0; }
        100% { clip-path: inset(0% 0 0% 0);   transform: translateX(0);    color:#000; }
      }
      .sv-glitch { animation: sv-glitch 0.08s steps(1) infinite; }
    `}</style>

    <div
      ref={loaderRef}
      style={{
        position: 'absolute', inset: 0, zIndex: 9999,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: animationEnded ? 'none' : 'auto'
      }}
    >
      <div
        ref={tvWrapRef}
        style={{
          position: 'absolute',
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translate(0%, 0%) scale(7) rotate(0deg)', opacity: 1,
          transformOrigin: 'center center'
        }}
      >
        <div 
          ref={innerWrapRef}
          style={{ 
            position: 'relative', 
            width: '60vh', 
            maxWidth: '800px',
            minWidth: '350px',
            transform: 'translate(7.6%, 0.75%)' 
          }}
        >
          <div
            ref={textRef}
            style={{
              position: 'absolute',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(12px, 1.3vw, 34px)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#0a0a0a',
              textTransform: 'uppercase',
              textShadow: '0 0 1px rgba(255,255,255,0.35)',
              pointerEvents: 'none',
              transform: 'rotate(-1.6deg) skewX(-5deg) scale(0.98)',
              transformOrigin: 'center',
              opacity: 1,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            Artem Melnik
          </div>
          
          <img
            ref={screenRef}
            src={screenSrc}
            alt="TV Screen Content"
            style={{
              position: 'absolute',
              zIndex: 1,
              borderRadius: '3%', 
              objectFit: 'cover',
              opacity: 0,
            }}
          />

          <img
            ref={imgRef}
            src="/tv-frame.png"
            alt=""
            onLoad={positionScreenElements}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              position: 'relative',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
    </>
  );
}