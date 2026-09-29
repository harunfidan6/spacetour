'use client';

import React, { useState } from 'react';
import { Sparkles, Telescope, ExternalLink, Calendar, Info } from 'lucide-react';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
}

const DEFAULT_APOD: ApodData = {
  title: 'James Webb: Yaratılış Sütunları (Pillars of Creation)',
  date: '28 Eylül 2026',
  explanation:
    'Kartal Bulutsusu (M16) içerisindeki yıldızlararası gaz ve toz kuleleri, yeni doğan protostarların yoğun ultraviyole radyasyonu ile şekillenmektedir. James Webb Uzay Teleskobu’nun yakın-kızılötesi kamerası (NIRCam), bu sütunların derinliklerindeki toz perdelerini delerek yıldız doğumunun en berrak detaylarını ortaya çıkarmaktadır.',
  url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  media_type: 'image',
  copyright: 'NASA, ESA, CSA, STScI'
};

export function NasaApodSection() {
  const [apod] = useState<ApodData>(DEFAULT_APOD);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-3xl border border-secondary/30 bg-card-bg/75 overflow-hidden backdrop-blur-md shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image side */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] overflow-hidden group">
          <img
            src={apod.url}
            alt={apod.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-secondary/40 bg-background/80 px-3 py-1 text-[11px] font-mono font-bold text-secondary backdrop-blur-md">
            <Telescope size={14} />
            GÜNÜN ASTRONOMİ GÖRÜNTÜSÜ
          </div>

          {apod.copyright && (
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-paper/70 bg-ink/60 px-2 py-0.5 rounded backdrop-blur-xs">
              © {apod.copyright}
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary mb-3">
              <Calendar size={14} className="text-secondary" />
              <span>{apod.date}</span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-4 tracking-tight">
              {apod.title}
            </h3>

            <p className={`text-sm text-text-secondary leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
              {apod.explanation}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs font-bold text-secondary hover:text-paper transition-colors"
            >
              {expanded ? 'Daha Az Göster ↑' : 'Tamamını Oku ↓'}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-card-border/60 flex items-center justify-between text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-secondary" />
              <span>NASA & JWST Arşivi</span>
            </div>

            <a
              href="https://apod.nasa.gov/apod/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
            >
              NASA APOD Kaynağı <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
