'use client';

import React, { useRef, useEffect } from 'react';
import { EventType } from '@/data/events';
import { Play, Sparkles, Moon, Sun, Orbit } from 'lucide-react';

interface SimulatorProps {
  type: EventType;
  title: string;
}

export function CosmicEventSimulator({ type, title }: SimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 200);

    let progress = 0;

    // Meteors array for meteor showers
    const meteors: { x: number; y: number; length: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 15; i++) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        length: Math.random() * 40 + 20,
        speed: Math.random() * 6 + 4,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    const render = () => {
      progress += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0a20');
      bgGrad.addColorStop(1, '#04040c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Background static stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 83.2) % height);
        ctx.fillRect(sx, sy, 1, 1);
      }

      const cx = width / 2;
      const cy = height / 2;

      // 1. LUNAR ECLIPSE (AY TUTULMASI)
      if (type === 'ay-tutulmasi') {
        const offset = Math.sin(progress) * 80;

        // Earth shadow (Umbra)
        ctx.fillStyle = 'rgba(180, 40, 20, 0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
        ctx.fill();

        // Moon entering shadow
        const moonX = cx + offset;
        const inShadow = Math.abs(offset) < 40;

        ctx.fillStyle = inShadow ? '#b23b28' : '#f0f0e0';
        ctx.shadowColor = inShadow ? '#ff4422' : '#ffffff';
        ctx.shadowBlur = inShadow ? 25 : 15;
        ctx.beginPath();
        ctx.arc(moonX, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#8a8a9a';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(inShadow ? 'TAM GÖLGE EVRESİ (KANLI AY)' : 'YARI GÖLGE GEÇİŞİ', cx, height - 15);
      }

      // 2. SOLAR ECLIPSE (GÜNEŞ TUTULMASI)
      else if (type === 'gunes-tutulmasi') {
        const moonOffset = Math.sin(progress) * 70;

        // Glowing Sun Corona
        const coronaGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, 65);
        coronaGrad.addColorStop(0, 'rgba(255, 220, 100, 0.9)');
        coronaGrad.addColorStop(0.5, 'rgba(255, 120, 20, 0.4)');
        coronaGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 65, 0, Math.PI * 2);
        ctx.fill();

        // Sun disc
        ctx.fillStyle = '#fff4cc';
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc passing in front
        ctx.fillStyle = '#06060c';
        ctx.beginPath();
        ctx.arc(cx + moonOffset, cy, 32.5, 0, Math.PI * 2);
        ctx.fill();

        // Corona spikes during totality
        if (Math.abs(moonOffset) < 5) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * 33, cy + Math.sin(a) * 33);
            ctx.lineTo(cx + Math.cos(a) * 55, cy + Math.sin(a) * 55);
            ctx.stroke();
          }
        }
      }

      // 3. METEOR SHOWER (METEOR YAĞMURU)
      else if (type === 'meteor-yagmuru') {
        // Radiant point
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(40, 40, 3, 0, Math.PI * 2);
        ctx.fill();

        meteors.forEach((m) => {
          m.x += m.speed;
          m.y += m.speed * 0.7;
          if (m.x > width || m.y > height) {
            m.x = Math.random() * width * 0.4;
            m.y = Math.random() * height * 0.3;
          }

          // Streak line
          const streakGrad = ctx.createLinearGradient(m.x - m.length, m.y - m.length * 0.7, m.x, m.y);
          streakGrad.addColorStop(0, 'rgba(255,91,34, 0)');
          streakGrad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);
          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(m.x - m.length, m.y - m.length * 0.7);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        });

        // Earth horizon curve
        ctx.fillStyle = '#0f2038';
        ctx.beginPath();
        ctx.arc(cx, height + 300, 350, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. PLANETARY CONJUNCTION / DEFAULT
      else {
        const p1X = cx - 40 + Math.sin(progress * 0.8) * 35;
        const p2X = cx + 40 - Math.sin(progress * 0.8) * 35;

        // Orbit paths
        ctx.strokeStyle = 'rgba(255,91,34, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 90, 35, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Planet 1 (Gold)
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p1X, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Planet 2 (Cyan)
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.beginPath();
        ctx.arc(p2X, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [type]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-background/60 backdrop-blur-md shadow-xl">
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <Sparkles size={14} className="text-primary animate-pulse" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
          KOZMİK SİMÜLASYON • {title}
        </span>
      </div>

      <canvas ref={canvasRef} className="w-full h-[180px] block" />
    </div>
  );
}
