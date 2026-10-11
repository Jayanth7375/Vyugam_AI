import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

/**
 * CyberCanvas
 * High-performance 60fps canvas rendering the animated Dotted Matrix Grid with:
 * - Orthogonal matrix of circular dots matching the reference image
 * - Autonomous traveling light spotlight sweeps that illuminate clusters of dots bright white/cyan
 * - Continuous propagating wave ripples across the dots
 * - Interactive mouse/laser-cursor illumination spotlight with radial falloff
 * - Click shockwave ripples expanding across the dotted field
 * - Subtle organic wave floating physics
 */
export const CyberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive spotlight
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Expanding ripples on click
    const ripples: Ripple[] = [];
    const handlePointerDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.5,
        alpha: 0.8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handlePointerDown);

    const DOT_SPACING = 26; // Spacing in pixels between dots
    let t = 0;

    const render = () => {
      t += 0.018;

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Update active ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 8;
        r.alpha *= 0.96;
        if (r.radius > r.maxRadius || r.alpha < 0.02) {
          ripples.splice(i, 1);
        }
      }

      // Clear with dark high-tech background
      ctx.fillStyle = '#060c18';
      ctx.fillRect(0, 0, width, height);

      // Autonomous Moving Light Spotlight Orbs (matching user's reference image)
      // Orb 1: sweeping from left to right across the canvas
      const orb1X = width * (0.5 + 0.38 * Math.cos(t * 0.85));
      const orb1Y = height * (0.42 + 0.22 * Math.sin(t * 1.3));
      const orb1Radius = 220;

      // Orb 2: secondary slower traveling pulse
      const orb2X = width * (0.35 + 0.32 * Math.sin(t * 0.65 + 1.2));
      const orb2Y = height * (0.58 + 0.25 * Math.cos(t * 0.9 + 2.1));
      const orb2Radius = 180;

      // Draw soft ambient atmospheric glows behind illuminated dot clusters
      ctx.save();
      const drawAtmosphericHalo = (cx: number, cy: number, rad: number, intensity: number) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0, `rgba(56, 189, 248, ${0.16 * intensity})`);
        grad.addColorStop(0.4, `rgba(2, 132, 199, ${0.08 * intensity})`);
        grad.addColorStop(1, 'rgba(6, 12, 24, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      };

      drawAtmosphericHalo(orb1X, orb1Y, orb1Radius * 1.3, 1.0);
      drawAtmosphericHalo(orb2X, orb2Y, orb2Radius * 1.2, 0.7);
      if (mouse.active) {
        drawAtmosphericHalo(mouse.x, mouse.y, 200, 1.2);
      }
      ctx.restore();

      // Render the Dot Matrix
      const cols = Math.ceil(width / DOT_SPACING) + 2;
      const rows = Math.ceil(height / DOT_SPACING) + 2;

      // Batch 1: Standard dim background dots for maximum 60fps performance
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
      ctx.beginPath();

      const illuminatedDots: Array<{
        x: number;
        y: number;
        radius: number;
        alpha: number;
        isSuperBright: boolean;
      }> = [];

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const baseX = c * DOT_SPACING;
          const baseY = r * DOT_SPACING;

          // Organic wave floating physics (subtle vertical/horizontal undulation)
          const wavePhase = (baseX * 0.008 + baseY * 0.006 - t * 2.2);
          const waveElevation = Math.sin(wavePhase) * 2.2;
          const posX = baseX;
          const posY = baseY + waveElevation;

          // Distance to Light Orbs
          const dist1 = Math.hypot(posX - orb1X, posY - orb1Y);
          const dist2 = Math.hypot(posX - orb2X, posY - orb2Y);
          const distMouse = mouse.active ? Math.hypot(posX - mouse.x, posY - mouse.y) : 9999;

          // Calculate illumination factor (0 to 1)
          let lightFactor = 0;

          if (dist1 < orb1Radius) {
            lightFactor += Math.pow(1 - dist1 / orb1Radius, 2.2);
          }
          if (dist2 < orb2Radius) {
            lightFactor += Math.pow(1 - dist2 / orb2Radius, 2.2) * 0.7;
          }
          if (distMouse < 180) {
            lightFactor += Math.pow(1 - distMouse / 180, 2.0) * 1.4;
          }

          // Check click ripples
          for (let ri = 0; ri < ripples.length; ri++) {
            const rip = ripples[ri];
            const distRip = Math.hypot(posX - rip.x, posY - rip.y);
            const ripDiff = Math.abs(distRip - rip.radius);
            if (ripDiff < 45) {
              const ripPower = (1 - ripDiff / 45) * rip.alpha;
              lightFactor += ripPower * 1.2;
            }
          }

          // Add continuous traveling wave shimmer
          const waveShimmer = Math.max(0, Math.sin(wavePhase) * 0.18);
          lightFactor += waveShimmer;

          if (lightFactor > 0.08) {
            // Illuminated dot to draw individually with bright glowing colors
            const normLight = Math.min(1.5, lightFactor);
            const radius = 1.6 + normLight * 2.6; // Expands up to ~4.5px just like the reference!
            illuminatedDots.push({
              x: posX,
              y: posY,
              radius,
              alpha: Math.min(1, 0.2 + normLight * 0.85),
              isSuperBright: normLight > 0.7,
            });
          } else {
            // Draw baseline matrix dot
            ctx.moveTo(posX + 1.5, posY);
            ctx.arc(posX, posY, 1.4, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
      ctx.restore();

      // Batch 2: Render Illuminated Dots with glowing cyan/white cores
      ctx.save();
      for (let i = 0; i < illuminatedDots.length; i++) {
        const dot = illuminatedDots[i];

        if (dot.isSuperBright) {
          // Intense pure white core with cyan halo (like the reference screenshot)
          ctx.fillStyle = `rgba(56, 189, 248, ${dot.alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft cyan glow
          ctx.fillStyle = `rgba(56, 189, 248, ${dot.alpha})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Subtle flowing cyber energy vectors across the bottom for branding continuity
      ctx.save();
      const waveConfigs = [
        { freq: 0.002, speed: 0.7, amp: height * 0.12, yOffset: height * 0.55, color: 'rgba(2, 132, 199, 0.14)' },
        { freq: 0.0028, speed: -0.6, amp: height * 0.16, yOffset: height * 0.58, color: 'rgba(56, 189, 248, 0.18)' },
      ];

      waveConfigs.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= width; x += 10) {
          const y = wave.yOffset +
            Math.sin(x * wave.freq + t * wave.speed) * wave.amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CyberCanvas;
