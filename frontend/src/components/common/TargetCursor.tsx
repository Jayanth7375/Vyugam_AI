import React, { useEffect, useRef, useState } from 'react';

/**
 * TargetCursor
 * Replicates the amber HUD crosshair target reticle cursor with dynamic X/Y coordinate readout:
 * - 4 sharp corner brackets forming a target reticle
 * - Centered target dot
 * - Real-time zero-padded 4-digit coordinate tracker: "X:XXXX Y:YYYY"
 * - Hardware-accelerated direct DOM transform via requestAnimationFrame (0ms latency, 0 React re-renders on mousemove)
 * - Interactive target-lock scale & snap effects on hover and click
 * - Automatically disabled on touch / mobile devices
 */
export const TargetCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.body.classList.add('hud-cursor-enabled');

    let mouseX = -100;
    let mouseY = -100;
    let targetX = -100;
    let targetY = -100;
    let rafId: number;

    const pad4 = (num: number) => {
      const clamped = Math.max(0, Math.min(9999, Math.round(num)));
      return String(clamped).padStart(4, '0');
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, textarea, select, [role="button"], [role="link"], .cursor-pointer, [data-interactive]')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const updateLoop = () => {
      // Immediate 1:1 hardware tracking for crisp, responsive feel
      mouseX = targetX;
      mouseY = targetY;

      if (cursorRef.current && mouseX >= 0 && mouseY >= 0) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (coordsRef.current && mouseX >= 0 && mouseY >= 0) {
        coordsRef.current.textContent = `X:${pad4(mouseX)} Y:${pad4(mouseY)}`;
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      document.body.classList.remove('hud-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] select-none transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Reticle Container: Centered exactly at (0, 0) relative to mouse */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        
        {/* 4 Corner Brackets Target Box: Red HUD Reticle */}
        <div
          ref={reticleRef}
          className={`relative w-11 h-11 transition-transform duration-100 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${
            isClicking
              ? 'scale-75'
              : isHoveringInteractive
              ? 'scale-110'
              : 'scale-100'
          }`}
        >
          {/* Top-Left Corner */}
          <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#dc2626]" />

          {/* Top-Right Corner */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#dc2626]" />

          {/* Bottom-Left Corner */}
          <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#dc2626]" />

          {/* Bottom-Right Corner */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#dc2626]" />

          {/* Center Target Dot */}
          <span
            className={`absolute top-1/2 left-1/2 w-[5px] h-[5px] -translate-x-1/2 -translate-y-1/2 bg-[#dc2626] rounded-full transition-transform duration-75 ${
              isClicking ? 'scale-150' : 'scale-100'
            }`}
          />
        </div>

        {/* Dynamic Coordinate Tracker: Placed below and to the right of reticle in Red */}
        <div className="absolute left-[48px] top-[42px] whitespace-nowrap pointer-events-none select-none">
          <span
            ref={coordsRef}
            className="font-mono text-xs font-bold tracking-wider text-[#dc2626] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            X:0000 Y:0000
          </span>
        </div>

      </div>
    </div>
  );
};
