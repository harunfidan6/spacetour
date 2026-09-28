"use client";

import { useState } from "react";
import Link from "next/link";
import { planets } from "@/data/planets";
import { constellations } from "@/data/constellations";
import { Search, Database, Fingerprint, Map } from "lucide-react";
import { PlanetScaleComparator } from "@/components/space/PlanetScaleComparator";
import { GravityCalculator } from "@/components/space/GravityCalculator";
import { CosmicTimeMachine } from "@/components/space/CosmicTimeMachine";
import { ExoplanetExplorer } from "@/components/space/ExoplanetExplorer";
import { AsteroidImpactSimulator } from "@/components/space/AsteroidImpactSimulator";

export default function AnsiklopediPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"Tümü" | "Gezegenler" | "Yıldızlar" | "Diğer">("Tümü");

  const filteredPlanets = planets.filter((planet) => {
    const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "Tümü" ||
      (activeTab === "Gezegenler" && planet.type === "gezegen") ||
      (activeTab === "Yıldızlar" && planet.type === "yıldız") ||
      (activeTab === "Diğer" && (planet.type === "ay" || planet.type === "cüce-gezegen"));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background/60 backdrop-blur-sm text-gray-400 p-4 sm:p-8 lg:p-12 relative z-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Terminal Header Section */}
        <section className="relative text-center space-y-8 py-8 border-b border-primary/20">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/30 mb-2 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <Database className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Merkezi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Veritabanı</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto font-mono text-gray-400">
            [BAĞLANTI KURULDU] • Gök cisimleri, yıldız sistemleri ve kozmik laboratuvar arşivine erişiliyor...
          </p>

          {/* Search and Flight Deck Console Filters */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <div className="relative w-full max-w-md group">
              <div className="relative flex items-center bg-card-bg rounded-xl border border-card-border focus-within:border-primary transition-colors">
                <Search className="absolute left-4 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Kozmik arşivi tara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white focus:outline-none font-mono placeholder-gray-600 text-sm"
                />
              </div>
            </div>
            
            <div className="flex bg-card-bg/80 p-1.5 rounded-xl border border-card-border shadow-inner w-full md:w-auto overflow-x-auto font-mono text-xs">
              {(["Tümü", "Gezegenler", "Yıldızlar", "Diğer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-primary text-background font-bold shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Celestial Bodies Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Fingerprint className="text-primary" />
            <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-widest">
              Kayıtlı Gök Cisimleri
            </h2>
          </div>
          
          {filteredPlanets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlanets.map((planet) => (
                <Link key={planet.id} href={`/ansiklopedi/${planet.id}`}>
                  <div className="relative group bg-card-bg/75 rounded-2xl p-6 border border-card-border overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:-translate-y-2 hover:border-primary/50">
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-16 h-16 flex items-center justify-center bg-black/40 rounded-2xl border border-card-border shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <span className="text-4xl drop-shadow-md">{planet.image}</span>
                      </div>
                      
                      <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider border backdrop-blur-sm ${
                        planet.type === 'yıldız' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                        planet.type === 'gezegen' ? 'bg-primary/10 text-primary border-primary/30' :
                        'bg-gray-500/10 text-gray-300 border-gray-500/30'
                      }`}>
                        {planet.type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-2 tracking-wide group-hover:text-primary transition-colors relative z-10">
                      {planet.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed relative z-10">
                      {planet.description}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2 relative z-10 font-mono text-[10px] text-gray-400">
                      <span className="bg-black/50 px-2 py-1 rounded border border-card-border uppercase">
                        ÇAP: {planet.facts.çap}
                      </span>
                      <span className="bg-black/50 px-2 py-1 rounded border border-card-border uppercase">
                        UYDU: {planet.facts.uyduSayısı}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card-bg/50 rounded-2xl border border-dashed border-card-border font-mono">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Veritabanında eşleşen kayıt bulunamadı.</p>
            </div>
          )}
        </section>

        {/* Interactive Lab Modules */}
        <div className="space-y-16 pt-12 border-t border-primary/20">
          <section>
            <PlanetScaleComparator />
          </section>

          <section>
            <GravityCalculator />
          </section>

          <section>
            <CosmicTimeMachine />
          </section>

          <section>
            <ExoplanetExplorer />
          </section>

          <section>
            <AsteroidImpactSimulator />
          </section>
        </div>

        {/* Constellations Section */}
        <section className="pt-12">
          <div className="flex items-center gap-3 mb-8">
            <Map className="text-secondary" />
            <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-widest">
              Gözlemlenebilir Takımyıldızlar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {constellations.map((constellation) => (
              <div key={constellation.id} className="bg-card-bg/60 rounded-2xl p-6 border border-card-border hover:border-secondary/50 flex flex-col items-center text-center transition-all hover:bg-card-bg hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] group">
                <span className="text-5xl mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{constellation.emoji}</span>
                <h3 className="text-lg font-black text-star-gold mb-1 tracking-wide">{constellation.name}</h3>
                <p className="text-xs text-secondary mb-4 font-mono border-b border-card-border w-full pb-2">{constellation.latinName}</p>
                <p className="text-xs text-gray-400 line-clamp-3 mb-6 leading-relaxed">{constellation.description}</p>
                <div className="mt-auto w-full flex justify-between bg-black/40 rounded-lg p-2 border border-card-border text-[9px] font-mono uppercase tracking-wider text-gray-500">
                  <span>{constellation.mainStars} Yıldız</span>
                  <span className="text-primary">Gözlem: {constellation.bestMonth}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
