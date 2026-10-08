'use client';

import React, { useState, useMemo } from 'react';
import {
  generateNumerologyReport,
  FullNumerologyReport,
  CoreNumberAnalysis,
  NUMBER_KEYS
} from '@/data/numerology';
import { NumericInput } from '@/components/ui/NumericInput';
import { daysInMonth } from '@/data/zodiac';
import { Compass, Shield, Feather, Key, Flame } from 'lucide-react';

// Ortak görünüm sınıfları
const FIELD = 'flex flex-col justify-end gap-1.5 lg:col-span-1';
const FIELD_LABEL = 'text-sm text-paper/70';
const FIELD_INPUT =
  'w-full min-h-10 border border-line bg-ink px-3 py-2 text-base text-paper focus:border-gold focus:outline-none';
const SECTION_LABEL = 'text-sm font-medium text-paper/80';
const READING_LABEL = 'text-sm font-medium text-gold';
const READING_TEXT = 'mt-2 text-base leading-relaxed text-paper/85';
const BIG_NUMBER = 'shrink-0 font-mono text-4xl font-semibold leading-none tabular-nums text-gold sm:text-5xl';
const DETAIL_TITLE = 'font-display text-xl font-semibold leading-tight text-paper sm:text-2xl';

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
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Numeroloji & Yaşam Yolu Analizi
        </h3>
        <p className="mt-2 text-sm text-paper/70">
          Pisagor ve Keldani geleneği · 4 temel sütun ve kişisel yıl
        </p>
      </div>

      {/* Interactive Input Form */}
      <div className="grid grid-cols-6 gap-3 sm:gap-4 lg:grid-cols-5">
        <label className={`${FIELD} col-span-3`}>
          <span className={FIELD_LABEL}>Adınız</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Adınız"
            className={FIELD_INPUT}
          />
        </label>

        <label className={`${FIELD} col-span-3`}>
          <span className={FIELD_LABEL}>Soyadınız</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Soyadınız"
            className={FIELD_INPUT}
          />
        </label>

        <label className={`${FIELD} col-span-2`}>
          <span className={FIELD_LABEL}>Doğum günü</span>
          <NumericInput
            value={day}
            min={1}
            max={maxDay}
            onValueChange={(v: number) => setDay(Math.min(v, maxDay))}
            className={FIELD_INPUT}
          />
        </label>

        <label className={`${FIELD} col-span-2`}>
          <span className={FIELD_LABEL}>Doğum ayı</span>
          <NumericInput
            value={month}
            min={1}
            max={12}
            onValueChange={(v: number) => {
              setMonth(v);
              setDay((d) => Math.min(d, daysInMonth(v, year)));
            }}
            className={FIELD_INPUT}
          />
        </label>

        <label className={`${FIELD} col-span-2`}>
          <span className={FIELD_LABEL}>Doğum yılı</span>
          <NumericInput
            value={year}
            min={1920}
            max={new Date().getFullYear()}
            onValueChange={(v: number) => {
              setYear(v);
              setDay((d) => Math.min(d, daysInMonth(month, v)));
            }}
            className={FIELD_INPUT}
          />
        </label>
      </div>

      {/* 5 Core Pillars Selector Cards */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line max-lg:fill-row-2 lg:grid-cols-5 lg:fill-row-5">
        {[
          {
            id: 'lifePath',
            label: 'Yaşam Yolu',
            num: report.lifePathNumber.number,
            title: report.lifePathNumber.archetype,
            icon: Compass,
            note: report.lifePathNumber.isMaster ? 'Master' : 'Çekirdek'
          },
          {
            id: 'destiny',
            label: 'Kader / İfade',
            num: report.destinyNumber.number,
            title: report.destinyNumber.archetype,
            icon: Feather,
            note: report.destinyNumber.isMaster ? 'Master' : 'İsim'
          },
          {
            id: 'soulUrge',
            label: 'Ruh Arzusu',
            num: report.soulUrgeNumber.number,
            title: report.soulUrgeNumber.archetype,
            icon: Flame,
            note: 'Sesli harfler'
          },
          {
            id: 'personality',
            label: 'Kişilik Maskesi',
            num: report.personalityNumber.number,
            title: report.personalityNumber.archetype,
            icon: Shield,
            note: 'Sessiz harfler'
          },
          {
            id: 'personalYear',
            label: `${report.personalYearNumber.year} Kişisel Yıl`,
            num: report.personalYearNumber.number,
            title: 'Yıllık döngü',
            icon: Key,
            note: ''
          }
        ].map((pillar) => {
          const isSelected = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActivePillar(pillar.id as typeof activePillar)}
              className={`flex min-w-0 flex-col p-4 text-left transition-colors cursor-pointer sm:p-5 ${
                isSelected
                  ? 'bg-gold text-ink'
                  : 'bg-ink-2 text-paper hover:bg-ink hover:text-gold'
              }`}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className={`text-sm font-medium ${isSelected ? 'text-ink' : 'text-paper/85'}`}>
                  {pillar.label}
                </span>
                {pillar.note ? (
                  <span
                    className={`text-xs ${
                      isSelected ? 'text-ink/80' : pillar.note === 'Master' ? 'text-gold' : 'text-paper/70'
                    }`}
                  >
                    {pillar.note}
                  </span>
                ) : null}
              </span>

              <span className="my-3 font-mono text-3xl font-semibold leading-none tabular-nums sm:text-4xl">
                {pillar.num}
              </span>

              <span className={`mt-auto text-sm leading-snug ${isSelected ? 'text-ink/85' : 'text-paper/75'}`}>
                {pillar.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Dossier for Selected Pillar */}
      {activePillar !== 'personalYear' ? (
        <div className="border border-line bg-ink-2 p-5 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className={BIG_NUMBER}>{activeAnalysis.number}</span>
            <div className="min-w-0 space-y-2">
              <h4 className={DETAIL_TITLE}>
                {activeAnalysis.title}
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/70">
                <span>
                  Yönetici gezegen: <span className="text-paper/90">{activeAnalysis.rulingCosmicBody}</span>
                </span>
                <span>
                  Uyumlu burçlar: <span className="text-paper/90">{activeAnalysis.zodiacAffinity}</span>
                </span>
              </div>
              <p className="text-sm text-paper/70">
                Anahtar sözcükler:{' '}
                <span className="text-paper/90">{activeAnalysis.sacredKeywords.join(' · ')}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-2">
            <div>
              <div className={READING_LABEL}>Öz enerji ve mizaç</div>
              <p className={READING_TEXT}>
                {activeAnalysis.essence}
              </p>
            </div>

            <div>
              <div className={READING_LABEL}>Ruhsal misyon</div>
              <p className={READING_TEXT}>
                {activeAnalysis.soulMission}
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium text-rose-signal">Karmik gölge ve sınav</div>
              <p className={READING_TEXT}>
                {activeAnalysis.shadowChallenge}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Personal Year Detailed Report */
        <div className="border border-line bg-ink-2 p-5 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className={BIG_NUMBER}>{report.personalYearNumber.number}</span>
            <div className="min-w-0">
              <div className="text-sm text-paper/70">{report.personalYearNumber.year} yılı kişisel döngüsü</div>
              <h4 className={`mt-1 ${DETAIL_TITLE}`}>
                {report.personalYearNumber.theme}
              </h4>
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <div className={READING_LABEL}>Bu yıl için tavsiye</div>
            <p className={READING_TEXT}>
              {report.personalYearNumber.advice}
            </p>
          </div>
        </div>
      )}

      {/* Ek sayılar: hangi sütun seçili olursa olsun görünür */}
      <div className="space-y-3">
        <div className={SECTION_LABEL}>Ek sayılar</div>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Doğum günü sayısı', n: report.birthdayNumber, t: NUMBER_KEYS[report.birthdayNumber]?.talent },
            { k: 'Olgunluk sayısı', n: report.maturityNumber, t: NUMBER_KEYS[report.maturityNumber]?.maturity },
            { k: 'Kişisel ay', n: report.personalMonth.number, t: NUMBER_KEYS[report.personalMonth.number]?.cycle },
            { k: `Bugün (${report.personalDay.date})`, n: report.personalDay.number, t: NUMBER_KEYS[report.personalDay.number]?.cycle },
          ].map((x) => (
            <div key={x.k} className="bg-ink p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-paper/70">{x.k}</span>
                <span className="font-mono text-2xl font-semibold leading-none tabular-nums text-gold">{x.n}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">{x.t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pythagorean Letters Reference Table */}
      <div className="space-y-3">
        <div className={SECTION_LABEL}>Pisagor harf-sayı tablosu</div>
        <div className="grid grid-cols-3 gap-px border border-line bg-line text-center sm:grid-cols-9">
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
            <div key={col.num} className="bg-ink px-2 py-2.5">
              <div className="font-mono text-sm font-semibold text-gold">{col.num}</div>
              <div className="mt-1 font-mono text-xs text-paper/80">{col.letters}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
