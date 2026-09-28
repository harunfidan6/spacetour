"use client";

import React, { useEffect, useRef } from "react";

interface GalaxyBackgroundProps {
  className?: string;
}

export function GalaxyBackground({ className = "" }: GalaxyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;

    // Parameters for galaxy
    const numStars = 3000;
    const numArms = 3;
    const armSpread = 0.5;
    const maxRadius = 1000;

    // We will pre-render the galaxy to an offscreen canvas for performance
    let offscreenCanvas: HTMLCanvasElement | null = null;
    let offscreenCtx: CanvasRenderingContext2D | null = null;

    interface TwinklingStar {
      x: number;
      y: number;
      size: number;
      color: string;
      baseAlpha: number;
      speed: number;
      phase: number;
    }

    const twinklingStars: TwinklingStar[] = [];

    const colors = [
      "#ffffff", // White
      "#e0f7fa", // Blueish
      "#fff9c4", // Yellow
      "#ffe0b2", // Orange
      "#ffcdd2", // Reddish
    ];

    const generateGalaxy = () => {
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = maxRadius * 2;
      offscreenCanvas.height = maxRadius * 2;
      offscreenCtx = offscreenCanvas.getContext("2d");
      if (!offscreenCtx) return;

      const oc = offscreenCtx;
      const ox = maxRadius;
      const oy = maxRadius;

      // Draw background
      oc.fillStyle = "#0a0a1a";
      oc.fillRect(0, 0, maxRadius * 2, maxRadius * 2);

      // Core glow
      const coreGradient = oc.createRadialGradient(ox, oy, 0, ox, oy, 250);
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      coreGradient.addColorStop(0.1, "rgba(255, 215, 0, 0.6)");
      coreGradient.addColorStop(0.3, "rgba(255, 107, 53, 0.3)");
      coreGradient.addColorStop(1, "rgba(10, 10, 26, 0)");
      oc.fillStyle = coreGradient;
      oc.fillRect(0, 0, maxRadius * 2, maxRadius * 2);

      // Nebula clouds
      for (let i = 0; i < 6; i++) {
        const nx = ox + (Math.random() - 0.5) * maxRadius * 0.8;
        const ny = oy + (Math.random() - 0.5) * maxRadius * 0.8;
        const nRadius = 150 + Math.random() * 200;
        const nGradient = oc.createRadialGradient(nx, ny, 0, nx, ny, nRadius);
        const hue = Math.random() > 0.5 ? "280" : "320"; // purple or pink
        const bHue = "200"; // blue
        
        const rColor = Math.random() > 0.3 ? hue : bHue;
        
        nGradient.addColorStop(0, `hsla(${rColor}, 80%, 60%, 0.1)`);
        nGradient.addColorStop(1, "rgba(10, 10, 26, 0)");
        oc.fillStyle = nGradient;
        oc.fillRect(nx - nRadius, ny - nRadius, nRadius * 2, nRadius * 2);
      }

      // Draw Stars and Dust Lanes
      for (let i = 0; i < numStars; i++) {
        const distance = Math.random() * maxRadius;
        // Logarithmic spiral angle
        const angle = distance * 0.005 + (Math.random() * Math.PI * 2) / numArms * Math.floor(Math.random() * numArms);
        
        // Spread the stars based on distance
        const spread = (Math.random() - 0.5) * distance * armSpread;
        
        const x = ox + Math.cos(angle) * distance + Math.cos(angle + Math.PI/2) * spread;
        const y = oy + Math.sin(angle) * distance + Math.sin(angle + Math.PI/2) * spread;

        // Determine size and color
        const size = Math.random() * 1.5 + 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Dust lanes: darker and fewer stars near inner edges of arms
        if (Math.random() < 0.15 && distance > 100 && distance < maxRadius * 0.8) {
           oc.fillStyle = "rgba(5, 5, 10, 0.5)";
           oc.beginPath();
           oc.arc(x, y, size * 5, 0, Math.PI * 2);
           oc.fill();
        } else {
           oc.fillStyle = color;
           oc.globalAlpha = Math.max(0.1, 1 - distance / maxRadius);
           oc.beginPath();
           oc.arc(x, y, size, 0, Math.PI * 2);
           oc.fill();
        }

        // Store some for twinkling
        if (Math.random() < 0.2) {
          twinklingStars.push({
            x: x - ox,
            y: y - oy,
            size: size * 1.5,
            color,
            baseAlpha: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 0.05 + 0.01,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      oc.globalAlpha = 1.0;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      cx = width / 2;
      cy = height / 2;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    generateGalaxy();

    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rotation = (elapsed * 0.0001) % (Math.PI * 2); // Slow rotation

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, width, height);

      if (offscreenCanvas) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        // Draw the static galaxy
        ctx.drawImage(offscreenCanvas, -maxRadius, -maxRadius);
        
        // Draw twinkling stars on top (they rotate with the galaxy)
        twinklingStars.forEach((star) => {
          star.phase += star.speed;
          const alpha = star.baseAlpha * (0.3 + 0.7 * Math.abs(Math.sin(star.phase)));
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
    />
  );
}
