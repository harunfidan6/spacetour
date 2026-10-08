import { HomeHero } from '@/components/home/HomeHero';
import { ChapterPanel } from '@/components/doc/ChapterPanel';
import { OrbCanvas } from '@/components/space/PlanetOrb';
import { SECTIONS } from '@/data/sections';

export default function Home() {
  return (
    // data-home: iç sayfalara özel sakin tipografi (globals.css "İç sayfalar") ana sayfaya uygulanmasın
    <div data-home className="relative bg-ink text-paper">
      <HomeHero />

      {SECTIONS.map((s, i) => (
        <ChapterPanel
          key={s.id}
          id={i === 0 ? 'bolumler' : undefined}
          section={s}
          flip={i % 2 === 1}
        />
      ))}

      <OrbCanvas />
    </div>
  );
}
