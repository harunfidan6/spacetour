import { planets } from "@/data/planets";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, ThermometerSun, Orbit, Globe2 } from "lucide-react";
import { PlanetHologram3D } from "@/components/space/PlanetHologram3D";

export function generateStaticParams() {
  return planets.map((p) => ({
    id: p.id,
  }));
}

export default async function PlanetDetail(props: PageProps<'/ansiklopedi/[id]'>) {
  const { id } = await props.params;
  const planet = planets.find((p) => p.id === id);
  
  if (!planet) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background/60 backdrop-blur-sm text-white p-6 lg:p-12 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/ansiklopedi" className="inline-flex items-center text-[#00d4ff] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ansiklopediye Dön
        </Link>

        {/* 3D Hologram Laboratory & Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card-bg/75 p-6 lg:p-8 rounded-3xl border border-card-border backdrop-blur-md shadow-2xl">
          {/* Left/Main: Interactive 3D Hologram */}
          <div className="lg:col-span-7">
            <PlanetHologram3D id={planet.id} />
          </div>

          {/* Right: Planet Title & Key Description */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{planet.image}</span>
              <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-bold uppercase tracking-widest text-primary">
                {planet.type}
              </div>
            </div>

            <h1 className={`text-4xl md:text-6xl font-black mb-3 ${planet.renk}`}>
              {planet.name}
            </h1>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              {planet.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-background/50 border border-card-border/60 text-xs font-mono text-text-secondary">
              ⚡ Farenizle yukarıdaki 3D modeli 360° serbestçe döndürebilir ve tekerlek ile yakınlaştırabilirsiniz.
            </div>
          </div>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FactCard icon={<Globe2 />} label="Çap" value={planet.facts.çap} />
          <FactCard icon={<Info />} label="Kütle" value={planet.facts.kütle} />
          <FactCard icon={<Orbit />} label="Yörünge" value={planet.facts.yörüngeSüresi} />
          <FactCard icon={<ThermometerSun />} label="Sıcaklık" value={planet.facts.sıcaklık} />
        </div>

        {/* Details and Extra Facts */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 bg-card-bg/60 p-6 rounded-3xl border border-card-border backdrop-blur-md">
            <h2 className="text-xl font-bold border-b border-card-border pb-3 text-foreground flex items-center gap-2">
              <Info className="text-primary h-5 w-5" />
              Detaylı Bilimsel Rapor
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-base whitespace-pre-line">
              {planet.detay}
            </div>
          </div>
          
          <div className="space-y-4 bg-card-bg/60 p-6 rounded-3xl border border-card-border backdrop-blur-md h-fit">
            <h2 className="text-xl font-bold border-b border-card-border pb-3 text-foreground">
              Ekstra Telemetri
            </h2>
            <div className="space-y-4 text-sm font-mono">
              <div className="flex justify-between border-b border-card-border/40 pb-2">
                <span className="text-text-secondary">Güneş'e Uzaklık</span>
                <span className="font-bold text-foreground">{planet.facts.güneşeUzaklık}</span>
              </div>
              <div className="flex justify-between border-b border-card-border/40 pb-2">
                <span className="text-text-secondary">Gün Süresi</span>
                <span className="font-bold text-foreground">{planet.facts.günSüresi}</span>
              </div>
              <div className="flex justify-between border-b border-card-border/40 pb-2">
                <span className="text-text-secondary">Doğal Uydu</span>
                <span className="font-bold text-foreground">{planet.facts.uyduSayısı} Adet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Halka Sistemi</span>
                <span className="font-bold text-foreground">{planet.facts.halkaSistemi ? "Var (Belirgin)" : "Yok"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-card-bg/70 p-4 rounded-2xl border border-card-border backdrop-blur-md flex flex-col items-center text-center">
      <div className="text-accent mb-2 w-6 h-6">
        {icon}
      </div>
      <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-1">{label}</span>
      <span className="font-bold text-sm md:text-base text-foreground">{value}</span>
    </div>
  );
}
