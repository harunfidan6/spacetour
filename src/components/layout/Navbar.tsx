"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Telescope,
  Calendar,
  BookOpen,
  Menu,
  X,
  Sparkles,
  Layers,
  Moon,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Ana Sayfa", icon: Sparkles },
  { href: "/harita", label: "Gökyüzü Haritası", icon: Telescope },
  { href: "/takvim", label: "Olay Takvimi", icon: Calendar },
  { href: "/ansiklopedi", label: "Ansiklopedi", icon: BookOpen },
  { href: "/astroloji", label: "Astroloji", icon: Moon },
  { href: "/gozlemevi", label: "Gözlemevi", icon: Layers },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,212,255,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">
                <span className="text-primary group-hover:text-cyan-300 transition-colors">SpaceTour</span>
                <span className="text-foreground ml-1">TR</span>
              </span>
              <span className="text-[9px] font-mono text-text-secondary tracking-widest mt-0.5">spacetour.com.tr</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-mono tracking-widest text-primary shadow-[inset_0_0_10px_rgba(0,212,255,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            3D UZAY YOLCULUĞU • CANLI
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(0,212,255,0.3),0_0_15px_rgba(0,212,255,0.2)]"
                    : "text-text-secondary hover:text-primary hover:bg-primary/5 hover:shadow-[inset_0_0_0_1px_rgba(0,212,255,0.2),0_0_10px_rgba(0,212,255,0.1)]"
                }`}
              >
                <Icon size={16} className={isActive ? "animate-pulse" : "group-hover:animate-pulse"} />
                {link.label}
                {/* Animated Indicator Line */}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive ? "w-full shadow-[0_0_8px_rgba(0,212,255,0.8)]" : "w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(0,212,255,0.8)]"}`} />
              </Link>
            );
          })}

          {/* Real-Time Visitor Telemetry Link */}
          <Link
            href="/admin/analitik"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/20 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] ml-2"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden xl:inline">Canlı Telemetri &</span>
            <span>Analitik</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-primary hover:text-cyan-300 hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
          aria-label="Menüyü aç/kapat"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-2xl px-4 py-4 shadow-[0_10px_30px_rgba(0,212,255,0.1)]">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-mono tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            TELEMETRY ACTIVE
          </div>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all overflow-hidden border ${
                    isActive
                      ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                      : "border-transparent text-text-secondary hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "animate-pulse" : ""} />
                  {link.label}
                  {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]" />}
                </Link>
              );
            })}

            <Link
              href="/admin/analitik"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-2"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Canlı Ziyaretçi Analitiği</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
