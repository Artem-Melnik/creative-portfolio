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
  const whiteBgRef   = useRef<HTMLDivElement>(null);
  const tvWrapRef    = useRef<HTMLDivElement>(null);
  const innerWrapRef = useRef<HTMLDivElement>(null); 
  const tvWhiteBgRef = useRef<HTMLDivElement>(null); // TV-internal white screen layer ref
  const screenRef    = useRef<HTMLImageElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const animRef      = useRef<number | null>(null);
  
  const [svgPath, setSvgPath] = useState<string>('');
  const [svgViewBox, setSvgViewBox] = useState<string>('0 0 100 100');
  const [animationEnded, setAnimationEnded] = useState(false);

  // Fetch the custom tv-vector.svg from root
  useEffect(() => {
    // fetch('/tv-vector.svg')
    fetch('')
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        const pathEl = doc.querySelector('path');

        if (svgEl && svgEl.getAttribute('viewBox')) {
          setSvgViewBox(svgEl.getAttribute('viewBox') || '0 0 100 100');
        }
        if (pathEl && pathEl.getAttribute('d')) {
          setSvgPath(pathEl.getAttribute('d') || '');
        }
      })
      .catch(() => {
        // Fallback default rectangle path if fetch fails
        setSvgPath('M 0 0 H 100 V 100 H 0 Z');
      });
  }, []);

  const positionScreenElements = useCallback(() => {
    const img       = imgRef.current;
    const tvWhiteBg = tvWhiteBgRef.current;
    const screen    = screenRef.current;
    const text      = textRef.current;
    if (!img) return;

    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (!w || !h) return; 

    const sl = w * SCREEN.left;
    const st = h * SCREEN.top;
    const sw = w * SCREEN.width;
    const sh = h * SCREEN.height;

    // Align internal white screen layer
    if (tvWhiteBg) {
      tvWhiteBg.style.left   = `${sl}px`;
      tvWhiteBg.style.top    = `${st}px`;
      tvWhiteBg.style.width  = `${sw}px`;
      tvWhiteBg.style.height = `${sh}px`;
    }

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
      glitch:   { start: 2700, end: 3000 },
      settle:   { start: 3000, end: 3300 },
      imageOn:  { start: 3000, end: 3600 }, 
      bgSuckIn: { start: 3000, end: 4500 }, // 1.0s suck-in phase
    };

    const easeOut    = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -18 * t);
    const easeInOut  = (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 32 * t - 16) / 2 : (2 - Math.pow(2, -32 * t + 16)) / 2;
    const easeInQuad = (t: number) => {
      const p = 1 - Math.pow(1 - t, 9);
      return 0.95 * p + 0.05 * Math.pow(t, 2.5);
    };
    const clamp      = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const prog       = (el: number, p: { start: number; end: number }) => clamp((el - p.start) / (p.end - p.start), 0, 1);

    let glitching = false;
    const t0 = performance.now();

    const tick = (now: number) => {
      const el        = now - t0;
      const loader    = loaderRef.current;
      const whiteBg   = whiteBgRef.current;
      const text      = textRef.current;
      const tvWrap    = tvWrapRef.current;
      const innerWrap = innerWrapRef.current;
      const tvWhiteBg = tvWhiteBgRef.current;
      const screen    = screenRef.current;
      const img       = imgRef.current;
      
      if (!loader || !whiteBg || !text || !tvWrap || !innerWrap || !screen || !img) return;

      const pTV     = easeOut(prog(el, PHASE.tvAppear));
      const pZoom   = easeInOut(prog(el, PHASE.zoomOut));
      const pSettle = easeOut(prog(el, PHASE.settle));
      const pImage  = prog(el, PHASE.imageOn);
      const pSuck   = prog(el, PHASE.bgSuckIn);

      const currentProgress = Math.max(pZoom, pSettle);
      const scale = 7 - 6.63 * currentProgress; 
      const rotation = -10.65 * pZoom;

      const translateX = 6.5 * pZoom;
      const translateY = -3.5 * pZoom;

      // Apply primary TV transform
      tvWrap.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale}) rotate(${rotation}deg)`;

      // Viewport centering shift during initial zoom out phase
      const shiftX = 7.6 * (1 - pZoom);
      const shiftY = 0.75 * (1 - pZoom);
      innerWrap.style.transform = `translate(${shiftX}%, ${shiftY}%)`;

      // Apply transform math to outer vector background
      if (pSuck > 0) {
        const easeSuck = easeInQuad(pSuck);
        const bgScale = 3.5 * (1 - easeSuck);

        whiteBg.style.transform = `translate(${translateX}%, ${translateY}%) scale(${bgScale}) rotate(${rotation}deg)`;
      } else {
        whiteBg.style.transform = `scale(3.5)`;
      }

      if (el >= PHASE.glitch.start && el < PHASE.glitch.end && !glitching) {
        glitching = true;
        text.classList.add('sv-glitch');
      }
      if (el >= PHASE.settle.start) {
        if (glitching) { glitching = false; text.classList.remove('sv-glitch'); }
        text.style.opacity = String(Math.max(0, 1 - prog(el, PHASE.settle)));
      }

      // Synchronized cross-fade between image and inner white background
      screen.style.opacity = String(pImage);

      if (tvWhiteBg) {
        const whiteOpacity = 1 - pImage;
        tvWhiteBg.style.opacity = String(whiteOpacity);
        tvWhiteBg.style.visibility = whiteOpacity <= 0 ? 'hidden' : 'visible';
      }

      if (el >= PHASE.bgSuckIn.end) {
        whiteBg.style.display = 'none';
        loader.style.pointerEvents = 'none';
        if (text) text.style.display = 'none';
        if (tvWhiteBg) {
          tvWhiteBg.style.opacity = '0';
          tvWhiteBg.style.visibility = 'hidden';
          tvWhiteBg.style.display = 'none';
        }
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
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: animationEnded ? 'none' : 'auto'
      }}
    >
      {/* Scaled SVG Background Layer - Outer vector */}
      <div
        ref={whiteBgRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center center',
          transform: 'scale(3.5)',
          willChange: 'transform'
        }}
      >
        <svg
          viewBox={svgViewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100vw', height: '100vh', display: 'block' }}
        >
          {svgPath ? (
            <path d={svgPath} fill="#ffffff" />
          ) : (
            <rect width="100%" height="100%" fill="#ffffff" />
          )}
        </svg>
      </div>

      <div
        ref={tvWrapRef}
        style={{
          position: 'absolute',
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translate(0%, 0%) scale(7) rotate(0deg)', opacity: 1,
          transformOrigin: 'center center',
          zIndex: 1
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
          {/* Inner TV White Screen Background Layer */}
          <div
            ref={tvWhiteBgRef}
            style={{
              position: 'absolute',
              zIndex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '3%',
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'none',
              willChange: 'opacity, visibility',
            }}
          />

          <img
            ref={screenRef}
            src={process.env.NEXT_PUBLIC_URL + screenSrc}
            alt="TV Screen Content"
            style={{
              position: 'absolute',
              zIndex: 2,
              borderRadius: '3%', 
              objectFit: 'cover',
              opacity: 0,
            }}
          />

          <img
            ref={imgRef}
            src={process.env.NEXT_PUBLIC_URL + "/tv-frame.png"}
            alt=""
            onLoad={positionScreenElements}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              position: 'relative',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />

          <div
            ref={textRef}
            style={{
              position: 'absolute',
              zIndex: 4,
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
        </div>
      </div>
    </div>
    </>
  );
}