'use client';

import React, { useState, useMemo } from 'react';
import {
  generateNumerologyReport,
  FullNumerologyReport,
  CoreNumberAnalysis
} from '@/data/numerology';
import {
  SacredTetractysGlyph
} from '@/components/ui/CosmicGlyphs';
import { NumericInput } from '@/components/ui/NumericInput';
import { daysInMonth } from '@/data/zodiac';
import { Compass, Shield, Feather, Key, Flame } from 'lucide-react';

export function CosmicNumerologyMatrix() {
  const [firstName, setFirstName] = useState('Atlas');
  const [lastName, setLastName] = useState('Yıldız');
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(1998);

  const [activePillar, setActivePillar] = useState<'lifePath' | 'destiny' | 'soulUrge' | 'personality' | 'personalYear'>('lifePath');

  const maxDay = daysInMonth(month, year);

  const report: FullNumerologyReport = useMemo(() => {
    return generateNumerologyReport(
      firstName || 'Kozmik',
      lastName || 'Yolcu',
      day,
      month,
      year
    );
  }, [firstName, lastName, day, month, year]);

  const activeAnalysis: CoreNumberAnalysis = useMemo(() => {
    switch (activePillar) {
      case 'destiny':
        return report.destinyNumber;
      case 'soulUrge':
        return report.soulUrgeNumber;
      case 'personality':
        return report.personalityNumber;
      case 'lifePath':
      default:
        return report.lifePathNumber;
    }
  }, [activePillar, report]);

  return (
    <div className="relative border border-line bg-ink p-6 sm:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <SacredTetractysGlyph size={18} className="text-gold" />
            <span className="doc-kicker text-gold">Pisagor ve Keldani Geleneği</span>
          </div>
          <h3 className="doc-title text-2xl sm:text-3xl text-paper mt-1">
            Numeroloji & Yaşam Yolu Analizi
          </h3>
        </div>
        <div className="doc-caption px-3 py-1.5 border border-line bg-ink-2 text-paper/80 text-xs">
          4 Temel Sütun ve Kişisel Yıl
        </div>
      </div>

      {/* Interactive Input Form */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 border border-line bg-ink-2 p-6">
        <div className="space-y-1.5">
          <label className="doc-kicker text-paper/60 text-[10px] uppercase">Adınız</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Adınız"
            className="w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="doc-kicker text-paper/60 text-[10px] uppercase">Soyadınız</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Soyadınız"
            className="w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="doc-kicker text-paper/60 text-[10px] uppercase">Doğum Günü</label>
          <NumericInput
            value={day}
            min={1}
            max={maxDay}
            onValueChange={(v: number) => setDay(Math.min(v, maxDay))}
            className="w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="doc-kicker text-paper/60 text-[10px] uppercase">Doğum Ayı</label>
          <NumericInput
            value={month}
            min={1}
            max={12}
            onValueChange={(v: number) => {
              setMonth(v);
              setDay((d) => Math.min(d, daysInMonth(v, year)));
            }}
            className="w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="doc-kicker text-paper/60 text-[10px] uppercase">Doğum Yılı</label>
          <NumericInput
            value={year}
            min={1920}
            max={new Date().getFullYear()}
            onValueChange={(v: number) => {
              setYear(v);
              setDay((d) => Math.min(d, daysInMonth(month, v)));
            }}
            className="w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* 5 Core Pillars Selector Cards */}
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-5 lg:fill-row-5">
        {[
          {
            id: 'lifePath',
            label: '1. Yaşam Yolu',
            num: report.lifePathNumber.number,
            title: report.lifePathNumber.archetype,
            icon: Compass,
            badge: report.lifePathNumber.isMaster ? 'MASTER' : 'ÇEKİRDEK'
          },
          {
            id: 'destiny',
            label: '2. Kader / İfade',
            num: report.destinyNumber.number,
            title: report.destinyNumber.archetype,
            icon: Feather,
            badge: report.destinyNumber.isMaster ? 'MASTER' : 'İSİM'
          },
          {
            id: 'soulUrge',
            label: '3. Ruh Arzusu',
            num: report.soulUrgeNumber.number,
            title: report.soulUrgeNumber.archetype,
            icon: Flame,
            badge: 'SESLİ'
          },
          {
            id: 'personality',
            label: '4. Kişilik Maskesi',
            num: report.personalityNumber.number,
            title: report.personalityNumber.archetype,
            icon: Shield,
            badge: 'SESSİZ'
          },
          {
            id: 'personalYear',
            label: `${report.personalYearNumber.year} Kişisel Yıl`,
            num: report.personalYearNumber.number,
            title: 'Yıllık Döngü',
            icon: Key,
            badge: String(report.personalYearNumber.year)
          }
        ].map((pillar) => {
          const isSelected = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActivePillar(pillar.id as typeof activePillar)}
              className={`p-5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gold text-ink font-semibold'
                  : 'bg-ink-2 text-paper hover:bg-ink hover:text-gold'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`doc-caption text-[10px] ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                  {pillar.label}
                </span>
                <span className={`doc-caption text-[10px] px-1.5 py-0.5 border ${
                  isSelected ? 'border-ink/30 text-ink' : 'border-line text-gold'
                }`}>
                  {pillar.badge}
                </span>
              </div>

              <div className="my-4 flex items-baseline gap-2">
                <span className="doc-title text-3xl sm:text-4xl">
                  {pillar.num}
                </span>
              </div>

              <div className={`text-xs truncate ${isSelected ? 'text-ink/90 font-bold' : 'text-paper/70'}`}>
                {pillar.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Dossier for Selected Pillar */}
      {activePillar !== 'personalYear' ? (
        <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center h-16 w-16 border border-line bg-ink rounded-full">
                <span className="doc-title text-3xl text-gold">{activeAnalysis.number}</span>
              </div>
              <div>
                <h4 className="doc-title text-2xl sm:text-3xl text-paper">
                  {activeAnalysis.title}
                </h4>
                <div className="doc-caption text-paper/60 text-xs mt-1">
                  Yönetici Gezegen: {activeAnalysis.rulingCosmicBody} · Zodyak Rezonansı: {activeAnalysis.zodiacAffinity}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeAnalysis.sacredKeywords.map((kw, i) => (
                <span key={i} className="doc-caption px-3 py-1 rounded-full border border-line bg-ink text-paper/85 text-[10px]">
                  # {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-line bg-ink p-5 space-y-2">
              <span className="doc-kicker text-gold">ÖZ ENERJİ & MİZACIN DOĞASI</span>
              <p className="text-xs sm:text-sm text-paper/85 leading-relaxed">
                {activeAnalysis.essence}
              </p>
            </div>

            <div className="border border-line bg-ink p-5 space-y-2">
              <span className="doc-kicker text-gold">RUHSAL YAŞAM MİSYONU</span>
              <p className="text-xs sm:text-sm text-paper/85 leading-relaxed">
                {activeAnalysis.soulMission}
              </p>
            </div>
          </div>

          <div className="border border-rose-signal/30 bg-rose-signal/5 p-5 space-y-2">
            <span className="doc-kicker text-rose-signal">KARMİK GÖLGE & AŞILMASI GEREKEN İMTİHAN</span>
            <p className="text-xs sm:text-sm text-paper/85 leading-relaxed">
              {activeAnalysis.shadowChallenge}
            </p>
          </div>
        </div>
      ) : (
        /* Personal Year Detailed Report */
        <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-line pb-6">
            <div className="grid place-items-center h-16 w-16 border border-line bg-ink rounded-full">
              <span className="doc-title text-3xl text-gold">{report.personalYearNumber.number}</span>
            </div>
            <div>
              <div className="doc-kicker text-gold">{report.personalYearNumber.year} YILI KİŞİSEL DÖNGÜSÜ</div>
              <h4 className="doc-title text-2xl sm:text-3xl text-paper mt-1">
                {report.personalYearNumber.theme}
              </h4>
            </div>
          </div>

          <div className="border border-line bg-ink p-6 space-y-3">
            <span className="doc-kicker text-gold">BU YIL İÇİN STRATEJİ & TAVSİYE</span>
            <p className="text-sm leading-relaxed text-paper/90">
              {report.personalYearNumber.advice}
            </p>
          </div>
        </div>
      )}

      {/* Pythagorean Letters Reference Table */}
      <div className="border-t border-line pt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="doc-caption text-paper/60 text-[10px]">PİSAGOR HARF - SAYI FREKANS TABLOSU</span>
          <span className="doc-caption text-paper/60 text-[10px]">1’DEN 9’A KADAR KOZMİK AKORLAR</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-px border border-line bg-line text-center text-xs">
          {[
            { num: 1, letters: 'A, J, S, Ş' },
            { num: 2, letters: 'B, K, T' },
            { num: 3, letters: 'C, Ç, L, U, Ü' },
            { num: 4, letters: 'D, M, V' },
            { num: 5, letters: 'E, N, W' },
            { num: 6, letters: 'F, O, Ö, X' },
            { num: 7, letters: 'G, Ğ, P, Y' },
            { num: 8, letters: 'H, Q, Z' },
            { num: 9, letters: 'I, İ, R' }
          ].map((col) => (
            <div key={col.num} className="bg-ink p-2.5">
              <div className="doc-caption text-gold font-bold">{col.num}</div>
              <div className="font-mono text-[10px] text-paper/70 mt-1">{col.letters}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
