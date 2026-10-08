'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

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
    <div className="border border-line bg-ink overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image side */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] overflow-hidden border-b lg:border-b-0 lg:border-r border-line">
          <Image
            src={apod.url}
            alt={apod.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[50%_30%]"
          />

          {apod.copyright && (
            <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] bg-ink/80 px-2 py-0.5 text-[11px] leading-snug text-paper/80">
              © {apod.copyright}
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="lg:col-span-6 p-5 sm:p-6 lg:p-8 flex flex-col justify-between bg-ink-2">
          <div>
            <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper/70">
              <span>Arşivden seçki</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{apod.date}</span>
            </p>

            <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl mb-4">
              {apod.title}
            </h3>

            <p className={`text-base text-paper/85 leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
              {apod.explanation}
            </p>

            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex min-h-9 items-center text-sm font-medium text-solar hover:underline cursor-pointer"
            >
              {expanded ? 'Daha az göster ↑' : 'Tamamını oku ↓'}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-paper/70">
            <span>NASA ve JWST arşivi</span>

            <a
              href="https://apod.nasa.gov/apod/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 font-medium text-solar hover:underline"
            >
              NASA APOD kaynağı <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
