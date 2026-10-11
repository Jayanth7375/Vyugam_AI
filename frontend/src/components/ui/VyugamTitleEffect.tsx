import React, { useRef, useState } from 'react';

interface VyugamTitleEffectProps {
  className?: string;
}

export const VyugamTitleEffect: React.FC<VyugamTitleEffectProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos(null);
  };

  return (
    <span
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block select-none cursor-pointer group ${className}`}
    >
      {/* Ambient Atmospheric Aura Glow behind the letters */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-purple-600/30 via-fuchsia-500/25 to-indigo-600/30 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none vyugam-aura-glow"
      />

      {/* Main Luxury Living Shimmer Text */}
      <span className="relative z-10 vyugam-shimmer-text tracking-tight transition-transform duration-300 group-hover:scale-[1.01]">
        VYUGAM AI
        <span className="vyugam-dot-sparkle">.</span>
      </span>

      {/* Interactive Cursor Spotlight Sheen */}
      {isHovered && mousePos && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 140px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.95) 0%, rgba(216, 180, 254, 0.45) 35%, transparent 70%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mixBlendMode: 'screen',
          }}
        >
          VYUGAM AI.
        </span>
      )}
    </span>
  );
};

export default VyugamTitleEffect;
