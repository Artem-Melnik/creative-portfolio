"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

// Precision-tuned screen coordinate boxes for the Junost-402B frame asset
const SCREEN = {
  left:   0.118,  // Left inset edge of the inner glass cut-out
  top:    0.145,  // Top inset edge
  width:  0.612,  // Relative screen span width
  height: 0.695,  // Relative screen span height
};

interface LoadingScreenProps {
  onComplete?: () => void;
  screenSrc?: string; // Change your inner image easily via props
}

export default function LoadingScreen({ onComplete, screenSrc = "/your-custom-screen.jpg" }: LoadingScreenProps) {
  const loaderRef    = useRef<HTMLDivElement>(null);
  const tvWrapRef    = useRef<HTMLDivElement>(null);
  const innerWrapRef = useRef<HTMLDivElement>(null); // New ref to handle exact glass centering
  const screenRef    = useRef<HTMLImageElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const animRef      = useRef<number | null>(null);
  const [animationEnded, setAnimationEnded] = useState(false);

  // Position the text + custom screen image to exactly cover the TV glass cut-out.
  //
  // IMPORTANT: this reads img.offsetWidth/offsetHeight (the element's LOCAL, un-transformed
  // layout size) rather than getBoundingClientRect() (the element's on-screen, POST-transform
  // size). Because tvWrapRef and innerWrapRef are scaled/translated/rotated via CSS `transform`,
  // and transforms are purely visual (they never change layout), any descendant that shares
  // those same ancestors will be scaled by the exact same factor automatically. So as long as
  // the text/screen boxes are expressed in that same untransformed local coordinate space, they
  // stay perfectly locked to the glass cut-out at every point in the animation — including
  // instantly on mount (scale 7) and all the way down to the final resting scale — with zero
  // per-frame recalculation needed.
  const positionScreenElements = useCallback(() => {
    const img    = imgRef.current;
    const screen = screenRef.current;
    const text   = textRef.current;
    if (!img) return;

    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (!w || !h) return; // frame image hasn't laid out yet (e.g. not loaded) — bail, onLoad will retry

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
      hold:      { start: 0,    end: 100  },
      tvAppear:  { start: 100,  end: 200 }, 
      zoomOut:   { start: 200,  end: 3000 },
      glitch:    { start: 3000, end: 3200 },
      settle:    { start: 3200, end: 3300 },
      imageOn:   { start: 3300, end: 3400 }, 
      bgFade:    { start: 3400, end: 3600 },
    };

    const easeOut   = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -18 * t);
    const easeInOut = (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 32 * t - 16) / 2 : (2 - Math.pow(2, -32 * t + 16)) / 2;
    const clamp     = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const prog      = (el: number, p: { start: number; end: number }) =>
      clamp((el - p.start) / (p.end - p.start), 0, 1);

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

      // Rotation matches the zoomOut curve perfectly
      const rotation = -10.65 * pZoom;

      // Animate from absolute center (0, 0) out to our calculated responsive head position
      const translateX = (56.6 - 50) * pZoom;
      const translateY = (40.8 - 50) * pZoom;

      tvWrap.style.transform = `translate(${translateX}vw, ${translateY}vh) scale(${scale}) rotate(${rotation}deg)`;

      // Fix for viewport centering: The glass is geographically at 42.4% X and 49.25% Y of the image frame.
      // We offset the inner container by +7.6% X and +0.75% Y when pZoom is 0 to perfectly align the glass to the screen center.
      // As pZoom reaches 1, we relax the shift back to 0 so the TV lands perfectly in its intended final layout spot.
      const shiftX = 7.6 * (1 - pZoom);
      const shiftY = 0.75 * (1 - pZoom);
      innerWrap.style.transform = `translate(${shiftX}%, ${shiftY}%)`;

      // Background fade logic
      const baseGray  = Math.round(255 * (1 - pTV * 0.15));
      const bgAlpha   = pBg > 0 ? 1 - pBg : 1;
      loader.style.background = `rgba(${baseGray},${baseGray},${baseGray},${bgAlpha})`;

      // Glitch effect sequencing
      if (el >= PHASE.glitch.start && el < PHASE.glitch.end && !glitching) {
        glitching = true;
        text.classList.add('sv-glitch');
      }
      if (el >= PHASE.settle.start) {
        if (glitching) { glitching = false; text.classList.remove('sv-glitch'); }
        text.style.opacity = String(Math.max(0, 1 - prog(el, PHASE.settle)));
      }
      // Note: no per-frame repositioning call here. Since the text/screen boxes are expressed
      // in the frame image's local (untransformed) coordinate space, tvWrap's scale/rotate and
      // innerWrap's shift — both applied above, every frame — automatically carry the text and
      // screen image along with the glass cut-out. Nothing needs to be recomputed as the TV zooms.

      // Smoothly fade up custom screen image asset
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

  // useLayoutEffect (not useEffect) so the glass box is measured and applied synchronously
  // before the browser paints the first frame — this is what makes "Artem Melnik" appear
  // instantly, already centered in the glass cut-out, with no flash of unstyled position.
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
          width: '100vw', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translate(0vw, 0vh) scale(7) rotate(0deg)', opacity: 1,
          transformOrigin: 'center center'
        }}
      >
        {/* Inner Wrapper - Dynamically shifted to maintain center logic on the glass */}
        <div 
          ref={innerWrapRef}
          style={{ 
            position: 'relative', 
            display: 'inline-block',
            transform: 'translate(7.6%, 0.75%)' // Initial state mapping exactly to 0 pZoom
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
            src={process.env.PUBLIC_URL + screenSrc}
            alt="TV Screen Content"
            style={{
              position: 'absolute',
              zIndex: 1,
              borderRadius: '12px',
              objectFit: 'cover',
              opacity: 0,
            }}
          />

          <img
            ref={imgRef}
            src={process.env.PUBLIC_URL + process.env.PUBLIC_URL + "/tv-frame.png"}
            alt=""
            onLoad={positionScreenElements}
            style={{
              width: 'min(35vw, 800px)',
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
