'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

function Loading({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`grid place-items-center border border-line bg-ink-2 ${tall ? 'h-full min-h-[60svh]' : 'h-[420px]'}`}>
      <span className="doc-caption">Kısım yükleniyor…</span>
    </div>
  );
}


/** Every tool, keyed by `${sectionId}/${slug}`; each is code-split so a sub-page only ships its own module. */
const MODULES: Record<string, ComponentType> = {
  // Gök haritası
  'harita/planetaryum': dynamic(() => import('@/components/space/Planetarium3D').then((m) => m.Planetarium3D), { ssr: false, loading: () => <Loading tall /> }),
  'harita/parlak-yildizlar': dynamic(() => import('@/components/space/BrightStarsRadar').then((m) => m.BrightStarsRadar), { loading: () => <Loading /> }),
  'harita/bortle': dynamic(() => import('@/components/space/BortleScaleSimulator').then((m) => m.BortleScaleSimulator), { loading: () => <Loading /> }),
  'harita/messier': dynamic(() => import('@/components/space/MessierDeepSkyRadar').then((m) => m.MessierDeepSkyRadar), { loading: () => <Loading /> }),
  'harita/polaris': dynamic(() => import('@/components/space/PolarisPrecessionHop').then((m) => m.PolarisPrecessionHop), { loading: () => <Loading /> }),

  // Ansiklopedi laboratuvarı
  'ansiklopedi/kepler-orrery': dynamic(() => import('@/components/space/SolarSystemOrrery').then((m) => m.SolarSystemOrrery), { loading: () => <Loading /> }),
  'ansiklopedi/olcek': dynamic(() => import('@/components/space/PlanetScaleComparator').then((m) => m.PlanetScaleComparator), { loading: () => <Loading /> }),
  'ansiklopedi/kutlecekim': dynamic(() => import('@/components/space/GravityCalculator').then((m) => m.GravityCalculator), { loading: () => <Loading /> }),
  'ansiklopedi/zaman-makinesi': dynamic(() => import('@/components/space/CosmicTimeMachine').then((m) => m.CosmicTimeMachine), { loading: () => <Loading /> }),
  'ansiklopedi/otegezegenler': dynamic(() => import('@/components/space/ExoplanetExplorer').then((m) => m.ExoplanetExplorer), { loading: () => <Loading /> }),
  'ansiklopedi/asteroit-carpmasi': dynamic(() => import('@/components/space/AsteroidImpactSimulator').then((m) => m.AsteroidImpactSimulator), { loading: () => <Loading /> }),
  'ansiklopedi/kara-delik': dynamic(() => import('@/components/space/BlackHoleSimulator').then((m) => m.BlackHoleSimulator), { loading: () => <Loading /> }),
  'ansiklopedi/hohmann-transferi': dynamic(() => import('@/components/space/HohmannTransferSimulator').then((m) => m.HohmannTransferSimulator), { loading: () => <Loading /> }),
  'ansiklopedi/kutlecekim-dalgalari': dynamic(() => import('@/components/space/GravitationalWaveInterferometer').then((m) => m.GravitationalWaveInterferometer), { loading: () => <Loading /> }),
  'ansiklopedi/kozmik-arka-plan': dynamic(() => import('@/components/space/PlanckCMBExplorer').then((m) => m.PlanckCMBExplorer), { loading: () => <Loading /> }),

  // Astroloji
  'astroloji/dogum-haritasi': dynamic(() => import('@/components/space/NatalChartCalculator').then((m) => m.NatalChartCalculator), { loading: () => <Loading /> }),
  'astroloji/sinastri': dynamic(() => import('@/components/space/SynastryChartCalculator').then((m) => m.SynastryChartCalculator), { loading: () => <Loading /> }),
  'astroloji/burc-uyumu': dynamic(() => import('@/components/space/ZodiacCompatibility').then((m) => m.ZodiacCompatibility), { loading: () => <Loading /> }),
  'astroloji/tarot': dynamic(() => import('@/components/space/CosmicTarotDrawer').then((m) => m.CosmicTarotDrawer), { loading: () => <Loading /> }),
  'astroloji/gunluk-burc': dynamic(() => import('@/components/space/DailyHoroscopeDeck').then((m) => m.DailyHoroscopeDeck), { loading: () => <Loading /> }),
  'astroloji/yildiz-fali': dynamic(() => import('@/components/space/StarOracleWidget').then((m) => m.StarOracleWidget), { loading: () => <Loading /> }),
  'astroloji/transitler': dynamic(() => import('@/components/space/DailyCosmicTransitWidget').then((m) => m.DailyCosmicTransitWidget), { loading: () => <Loading /> }),
  'astroloji/ay-evreleri': dynamic(() => import('@/components/space/LunarPhaseTracker').then((m) => m.LunarPhaseTracker), { loading: () => <Loading /> }),
  'astroloji/retrolar': dynamic(() => import('@/components/space/CosmicRetrogradeRadar').then((m) => m.CosmicRetrogradeRadar), { loading: () => <Loading /> }),
  'astroloji/numeroloji': dynamic(() => import('@/components/space/CosmicNumerologyMatrix').then((m) => m.CosmicNumerologyMatrix), { loading: () => <Loading /> }),

  // Gözlemevi
  'gozlemevi/spektrum': dynamic(() => import('@/components/space/SpectrumObservationDesk').then((m) => m.SpectrumObservationDesk), { loading: () => <Loading /> }),
  'gozlemevi/webb-hubble': dynamic(() => import('@/components/space/WebbHubbleCompareSlider').then((m) => m.WebbHubbleCompareSlider), { loading: () => <Loading /> }),
  'gozlemevi/radyo': dynamic(() => import('@/components/space/CosmicRadioSpectrograph').then((m) => m.CosmicRadioSpectrograph), { loading: () => <Loading /> }),
  'gozlemevi/gozlemevleri': dynamic(() => import('@/components/space/MegaObservatoriesRegistry').then((m) => m.MegaObservatoriesRegistry), { loading: () => <Loading /> }),
  'gozlemevi/spektroskopi': dynamic(() => import('@/components/space/StellarSpectroscopyLab').then((m) => m.StellarSpectroscopyLab), { loading: () => <Loading /> }),
  'gozlemevi/transit': dynamic(() => import('@/components/space/ExoplanetTransitLab').then((m) => m.ExoplanetTransitLab), { loading: () => <Loading /> }),
  'gozlemevi/akademi': dynamic(() => import('@/components/space/CosmicAcademyQuiz').then((m) => m.CosmicAcademyQuiz), { loading: () => <Loading /> }),

  // Canlı gökyüzü
  'canli/bu-gece': dynamic(() => import('@/components/space/SkyTonightWidget').then((m) => m.SkyTonightWidget), { loading: () => <Loading /> }),
  'canli/iss': dynamic(() => import('@/components/space/IssTracker').then((m) => m.IssTracker), { loading: () => <Loading /> }),
  'canli/uzay-havasi': dynamic(() => import('@/components/space/SpaceWeatherWidget').then((m) => m.SpaceWeatherWidget), { loading: () => <Loading /> }),
  'canli/sondalar': dynamic(() => import('@/components/space/InterstellarProbes').then((m) => m.InterstellarProbes), { loading: () => <Loading /> }),
  'canli/arsiv-goruntusu': dynamic(() => import('@/components/space/NasaApodSection').then((m) => m.NasaApodSection), { loading: () => <Loading /> }),
};

export function ModuleRenderer({ id }: { id: string }) {
  const Tool = MODULES[id];
  return Tool ? <Tool /> : null;
}
