'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Telescope, ExternalLink, Calendar } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
}

const FEATURED_IMAGE: ApodData = {
  title: 'James Webb: Yaratılış Sütunları (Pillars of Creation)',
  date: '19 Ekim 2022',
  explanation:
    'Kartal Bulutsusu (M16) içerisindeki yıldızlararası gaz ve toz kuleleri, yeni doğan protostarların yoğun ultraviyole radyasyonu ile şekillenmektedir. James Webb Uzay Teleskobu’nun yakın-kızılötesi kamerası (NIRCam), bu sütunların derinliklerindeki toz perdelerini delerek yıldız doğumunun en berrak detaylarını ortaya çıkarmaktadır.',
  url: '/images/space/pillars-of-creation-nircam-image-e97a7a.jpg',
  media_type: 'image',
  copyright: 'NASA, ESA, CSA, STScI'
};

export function NasaApodSection() {
  const apod = FEATURED_IMAGE;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative ticks border border-line bg-ink overflow-hidden">
      <Ticks />
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image side */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] overflow-hidden group border-b lg:border-b-0 lg:border-r border-line">
          <Image
            src={apod.url}
            alt={apod.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105"
          />
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 border border-line bg-ink/90 px-3 py-1 text-[11px] font-mono font-bold text-violet backdrop-blur-md uppercase tracking-wider">
            <Telescope size={13} />
            <span>ARŞİVDEN SEÇKİ</span>
          </div>

          {apod.copyright && (
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-muted bg-ink/80 px-2 py-0.5 border border-line backdrop-blur-xs">
              © {apod.copyright}
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between bg-ink-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted mb-3 uppercase tracking-wider">
              <Calendar size={13} className="text-solar" />
              <span>{apod.date}</span>
            </div>

            <h3 className="display display-tight text-2xl lg:text-3xl text-paper mb-4">
              {apod.title}
            </h3>

            <p className={`text-xs text-muted leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
              {apod.explanation}
            </p>

            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs font-mono font-bold text-solar hover:underline transition-colors uppercase tracking-wider cursor-pointer"
            >
              {expanded ? 'Daha Az Göster ↑' : 'Tamamını Oku ↓'}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-solar" />
              <span>NASA & JWST Arşivi</span>
            </div>

            <a
              href="https://apod.nasa.gov/apod/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-solar hover:underline font-bold"
            >
              NASA APOD Kaynağı <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
