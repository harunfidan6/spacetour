'use client';

import React, { useState, useMemo } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, ChevronRight, HelpCircle, Shield, FileText, Download, Share2 } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  scientificConcept: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Görelilik Fiziği',
    question: 'Bir uzay aracı ışık hızının %99’una ulaştığında, Dünya’daki bir gözlemciye kıyasla uzay aracındaki saat nasıl ilerler?',
    options: [
      'Uzay aracındaki saat daha hızlı akar (zaman büzülmesi).',
      'Uzay aracındaki saat çok daha yavaş akar (zaman genleşmesi).',
      'Saat tamamen durur ve geriye doğru çalışmaya başlar.',
      'Zaman hızdan bağımsızdır, hiçbir fark gözlenmez.'
    ],
    correctAnswer: 1,
    explanation: 'Einstein’ın Özel Görelilik kuramına göre (Lorentz faktörü γ = 1 / √(1 - v²/c²)), ışık hızına yaklaşıldığında hareketli referans sisteminde zaman durgun gözlemciye göre genleşir ve çok daha yavaş akar.',
    scientificConcept: 'Lorentz Zaman Genleşmesi (Time Dilation)'
  },
  {
    id: 2,
    category: 'Karadelik Astrofiziği',
    question: 'Bir yıldızın kütlesi karadeliğe dönüştüğünde, ışığın bile kaçamadığı sınır bölgesine ne ad verilir?',
    options: [
      'Akkresyon (Yığılma) Diski',
      'Roche Limiti',
      'Olay Ufku (Event Horizon)',
      'Manyetosfer Tabakası'
    ],
    correctAnswer: 2,
    explanation: 'Olay ufku, kaçış hızının ışık hızına (c) eşit olduğu eşik yarıçapıdır (Schwarzschild yarıçapı: r_s = 2GM/c²). Bu sınırın ötesindeki hiçbir madde veya foton evrene geri dönemez.',
    scientificConcept: 'Schwarzschild Olay Ufku'
  },
  {
    id: 3,
    category: 'Kozmoloji & Erken Evren',
    question: 'Büyük Patlama’dan yaklaşık 380.000 yıl sonra evrenin saydamlaşmasıyla serbest kalan ve günümüzde 2.73 Kelvin sıcaklıkta tüm gökyüzünü kaplayan fosil ışıma nedir?',
    options: [
      'Kozmik Mikrodalga Arka Plan Işıması (CMB)',
      'Gama Işını Patlaması (GRB)',
      'Zodyak Işığı',
      'Van Allen Radyasyon Kuşağı'
    ],
    correctAnswer: 0,
    explanation: 'Rekombinasyon döneminde elektronların protonlarla birleşip nötr hidrojen atomlarını oluşturmasıyla fotonlar serbest kaldı. 13.8 milyar yıllık evren genişlemesiyle bu ışık mikrodalga dalgaboyuna (2.73 K) kadar soğumuştur.',
    scientificConcept: 'Kozmik Mikrodalga Arka Planı (CMBR)'
  },
  {
    id: 4,
    category: 'Yıldız Evrimi',
    question: 'Bir beyaz cücenin kendi kütleçekimi altında çökmeden taşıyabileceği maksimum kütle sınırı (yaklaşık 1.44 Güneş kütlesi) kimin adıyla anılır?',
    options: [
      'Oppenheimer-Volkoff Limiti',
      'Chandrasekhar Limiti',
      'Hubble Sabiti',
      'Kuiper Sınırı'
    ],
    correctAnswer: 1,
    explanation: 'Nobel ödüllü astrofizikçi Subrahmanyan Chandrasekhar tarafından hesaplanan bu limit (1.44 M☉), elektron dejenerasyon basıncının kütleçekimini dengeleyebileceği üst sınırdır. Bu limit aşılırsa Tip Ia süpernova veya nötron yıldızı oluşur.',
    scientificConcept: 'Chandrasekhar Kütle Limiti'
  },
  {
    id: 5,
    category: 'Yörünge Mekaniği',
    question: 'James Webb Uzay Teleskobu (JWST), Dünya ile Güneş arasındaki kütleçekiminin dengelendiği hangi noktada yörüngededir?',
    options: [
      'Alçak Dünya Yörüngesi (LEO - 400 km)',
      'Ay Yörüngesi (L1)',
      'Lagrange L2 Noktası (Dünya’dan 1.5 Milyon km)',
      'Güneş-Dünya L4 Truva Noktası'
    ],
    correctAnswer: 2,
    explanation: 'Lagrange L2 noktası, Dünya’nın Güneş’ten uzak arka tarafında yer alır. Bu sayede Webb, Dünya ve Güneş’i aynı yönde arkasına alarak güneş kalkanıyla kendini -233°C’ye kadar soğuk tutabilir.',
    scientificConcept: 'Lagrange Kütleçekim Denge Noktaları'
  },
  {
    id: 6,
    category: 'Astrofizik & Çekirdek',
    question: 'Güneşimiz enerjisini çekirdeğinde hangi nükleer füzyon süreciyle üretir?',
    options: [
      'Uranyum Fisyon Reaksiyonu',
      'Proton-Proton Zinciri (Hidrojeni Helyuma Dönüştürme)',
      'Karbon-Azot-Oksijen (CNO) Döngüsü',
      'Üçlü Alfa Helyum Yakma Süreci'
    ],
    correctAnswer: 1,
    explanation: 'Güneş benzeri düşük ve orta kütleli yıldızların çekirdeğinde 15 milyon Kelvin sıcaklıkta 4 hidrojen çekirdeği (proton) birleşerek 1 helyum çekirdeğine dönüşür ve kütle kaybı E=mc² uyarınca saf enerjiye çevrilir.',
    scientificConcept: 'Proton-Proton Zincirleme Füzyonu'
  },
  {
    id: 7,
    category: 'Gözlemsel Astronomi',
    question: 'Bir galaksinin yaydığı ışık tayfındaki çizgiler kırmızıya kayıyorsa (Redshift), bu durum evren hakkında neyi kanıtlar?',
    options: [
      'Galaksinin bize doğru hızla yaklaştığını.',
      'Uzay dokusunun genişlediğini ve galaksilerin bizden uzaklaştığını.',
      'Galaksinin yıldızlarının soğuduğunu.',
      'Işığın kara delikler tarafından tamamen emildiğini.'
    ],
    correctAnswer: 1,
    explanation: 'Edwin Hubble tarafından keşfedilen Hubble-Lemaître Yasası uyarınca, uzayın kendisi genişlediği için uzak galaksilerden gelen fotonların dalgaboyu esner ve kırmızıya kayar (Doppler benzeri kozmolojik kırmızıya kayma).',
    scientificConcept: 'Kozmolojik Kırmızıya Kayma (Cosmological Redshift)'
  },
  {
    id: 8,
    category: 'Gezegen Bilimi',
    question: 'Güneş Sistemi’ndeki en büyük yanardağ olan Olympus Mons (yaklaşık 22 km yükseklik) hangi gezegende yer alır?',
    options: [
      'Venüs',
      'Merkür',
      'Mars',
      'Jüpiter uydusu Io'
    ],
    correctAnswer: 2,
    explanation: 'Olympus Mons, Mars’ta bulunan devasa bir kalkan yanardağıdır. Mars’ta tektonik plaka hareketleri olmadığı için magma milyonlarca yıl boyunca aynı noktadan fışkırarak Everest’in neredeyse 2.5 katı büyüklüğe ulaşmıştır.',
    scientificConcept: 'Karasal Gezegen Volkanizması'
  },
  {
    id: 9,
    category: 'Modern Fizik',
    question: 'Kütleçekimsel dalgalar (uzay-zaman dokusundaki dalgalanmalar) Dünya’da ilk kez 2015 yılında hangi devasa lazer interferometre deneyiyle doğrudan tespit edilmiştir?',
    options: [
      'CERN / Büyük Hadron Çarpıştırıcısı',
      'LIGO (Laser Interferometer Gravitational-Wave Observatory)',
      'Event Horizon Telescope (EHT)',
      'ALMA Radyo Teleskop Dizisi'
    ],
    correctAnswer: 1,
    explanation: 'LIGO dedektörleri, 1.3 milyar ışık yılı uzaktaki iki kara deliğin birleşmesi sırasında yayılan ve bir proton çapının 10.000’de biri kadar uzay-zamanı büken kütleçekim dalgalarını lazer interferometresiyle ölçmeyi başarmıştır.',
    scientificConcept: 'Kütleçekimsel Dalga Tespiti'
  },
  {
    id: 10,
    category: 'Ötegezegenler & Yaşam',
    question: 'Bir yıldızın etrafında, gezegenin yüzeyinde sıvı suyun bulunabileceği sıcaklık aralığına sahip yörünge kuşağına ne ad verilir?',
    options: [
      'Kuiper Kuşağı',
      'Goldilocks (Yaşanabilir) Kuşağı',
      'Oort Bulutu Kuşağı',
      'Asteroid Kuşağı'
    ],
    correctAnswer: 1,
    explanation: 'Yaşanabilir Kuşak (Circumstellar Habitable Zone) veya Goldilocks Kuşağı; yıldızdan ne çok sıcak ne de çok soğuk olan, atmosferik basınç altında sıvı suyun varlığını koruyabildiği ideal yörünge mesafesidir.',
    scientificConcept: 'Yaşanabilir Bölge (Habitable Zone)'
  }
];

export function CosmicAcademyQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('Kozmik Kaşif');

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const score = useMemo(() => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  }, [selectedAnswers]);

  const percentage = Math.round((score / totalQuestions) * 100);

  const rankInfo = useMemo(() => {
    if (percentage >= 90) {
      return {
        title: 'Galaktik Baş Astrofizikçi',
        grade: 'Kozmik Seviye V (Mükemmel)',
        color: 'text-amber-400',
        badge: '👑 ASTRO-PH-ALPHA',
        desc: 'Genel Görelilik, erken evren kozmolojisi ve derin uzay fiziğinde en yüksek yetkinlik derecesi.'
      };
    } else if (percentage >= 70) {
      return {
        title: 'Derin Uzay Keşif Pilotu',
        grade: 'Kozmik Seviye IV (İleri Düzey)',
        color: 'text-emerald-400',
        badge: '🚀 DEEP-SPACE-CADET',
        desc: 'Yıldız evrimi ve orbital mekanik konularında güçlü teorik ve operasyonel bilgiye sahip.'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Yörünge Görev Uzmanı',
        grade: 'Kozmik Seviye III (Orta Seviye)',
        color: 'text-cyan-400',
        badge: '🛰 ORBIT-SPECIALIST',
        desc: 'Güneş sistemi ve gezegen bilimleri temellerinde başarılı kavrayış.'
      };
    } else {
      return {
        title: 'Gözlemevi Asistanı & Kaşif',
        grade: 'Kozmik Seviye II (Başlangıç)',
        color: 'text-violet',
        badge: '🔭 OBSERVER-INITIATE',
        desc: 'Evrenin gizemlerini keşfetme yolunda harika bir ilk adım. Tekrar deneyerek unvanını yükselt!'
      };
    }
  }, [percentage]);

  const verificationHash = useMemo(() => {
    return `ASTRO-${Math.abs(score * 31415 + percentage * 777).toString(16).toUpperCase()}-TR`;
  }, [score, percentage]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-violet">
            <span className="live-dot" /> AstroTR Kozmik Akademi & Değerlendirme
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Astrofizik <span className="serif-i text-violet">& yetkinlik testi</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            10 soruluk interaktif astrofizik sınavını tamamlayın, evrenin kurallarına dair bilginizi ölçün ve adınıza onaylı resmi AstroTR Kozmik Kaşif Sertifikası kazanın.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2">
          <div className="label px-3 py-1.5 border border-line bg-ink-2 text-muted">
            Soru: <span className="text-paper font-bold">{currentQuestionIndex + 1} / {totalQuestions}</span>
          </div>
          <div className="label px-3 py-1.5 border border-line bg-ink-2 text-muted">
            Doğru: <span className="text-lime font-bold">{score}</span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        /* Quiz in progress */
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-ink-2 h-1 overflow-hidden border border-line">
            <div
              className="h-full bg-violet transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="label text-violet border border-violet/30 bg-ink px-2.5 py-1">
                {currentQ.category}
              </span>
              <span className="label text-muted">ID: #Q{currentQ.id.toString().padStart(2, '0')}</span>
            </div>

            <h4 className="display display-tight text-xl md:text-2xl text-paper">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 gap-px border border-line bg-line pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                const isCorrect = idx === currentQ.correctAnswer;
                const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

                let btnStyle = 'bg-ink text-paper hover:bg-ink-3';
                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-lime text-ink font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-signal text-ink';
                  } else {
                    btnStyle = 'bg-ink/50 text-muted opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 text-left transition-colors flex items-center justify-between gap-4 text-sm cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 border border-line bg-ink-2 flex items-center justify-center font-mono text-xs text-muted flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-ink flex-shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-ink flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Drawer */}
            {showExplanation && (
              <div className="p-5 border border-line bg-ink space-y-3">
                <div className="flex items-center justify-between">
                  <span className="label text-violet flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Bilimsel Açıklama: {currentQ.scientificConcept}</span>
                  </span>
                  <span className={`label ${selectedAnswers[currentQuestionIndex] === currentQ.correctAnswer ? 'text-lime' : 'text-rose-signal'}`}>
                    {selectedAnswers[currentQuestionIndex] === currentQ.correctAnswer ? '✓ Doğru Cevap' : '✗ Yanlış Cevap'}
                  </span>
                </div>
                <p className="text-xs text-paper/80 leading-relaxed">
                  {currentQ.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="label px-5 py-2.5 bg-paper text-ink font-bold flex items-center gap-2 hover:bg-paper/90 transition-colors cursor-pointer"
                  >
                    <span>{currentQuestionIndex < totalQuestions - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished - Official Certificate View */
        <div className="space-y-8">
          <div className="p-6 sm:p-8 border border-line bg-ink-2 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 border border-violet/40 bg-ink text-violet mb-2">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="display display-tight text-3xl md:text-4xl text-paper">
              Değerlendirme Tamamlandı
            </h4>
            <p className="text-sm text-paper/70 max-w-lg mx-auto">
              Toplam 10 sorudan <span className="text-lime font-bold">{score}</span> tanesini doğru cevaplayarak <span className="text-paper font-bold">%{percentage}</span> başarı oranı elde ettiniz.
            </p>

            {/* Candidate Name Input */}
            <div className="max-w-xs mx-auto pt-2">
              <label className="block label text-muted mb-1 text-left">
                Sertifikada Görünecek İsim / Çağrı Kodu:
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                maxLength={30}
                className="w-full bg-ink border border-line px-4 py-2 font-mono text-xs text-paper focus:outline-none focus:border-violet"
                placeholder="Adınız veya Çağrı Kodunuz"
              />
            </div>
          </div>

          {/* Printable Certificate Preview */}
          <div className="ticks relative border border-line bg-ink p-8 sm:p-12 space-y-6 text-center">
            <Ticks />

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 label text-muted">CERT-ID: {verificationHash}</div>
            <div className="absolute top-4 right-4 label text-muted">Gözlemevi Onaylı</div>
            <div className="absolute bottom-4 left-4 label text-muted">Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
            <div className="absolute bottom-4 right-4 label text-lime">Durum: Onaylandı</div>

            <div className="space-y-2 pt-6">
              <span className="label text-violet tracking-[0.25em]">
                ASTROTR KOZMİK GÖZLEMEVİ AKADEMİSİ
              </span>
              <h2 className="display display-tight text-3xl md:text-5xl text-paper tracking-wider">
                Astrofizik Yetkinlik Belgesi
              </h2>
              <div className="w-24 h-px bg-violet mx-auto mt-2" />
            </div>

            <div className="space-y-2 py-4">
              <p className="label text-muted">Bu belge, evrenin fiziksel yasaları sınavını başarıyla tamamlayan</p>
              <h3 className="display display-tight text-2xl md:text-4xl text-paper font-bold uppercase underline decoration-violet decoration-2 underline-offset-8">
                {candidateName || 'Kozmik Kaşif'}
              </h3>
              <p className="text-xs text-paper/70 max-w-xl mx-auto pt-2 leading-relaxed">
                adına düzenlenmiş olup adayın astrofizik, genel görelilik, derin uzay dalgaboyu gözlemleri ve yörünge mekaniği konularındaki yetkinliğini tasdik eder.
              </p>
            </div>

            {/* Rank Card inside Certificate */}
            <div className="inline-block border border-line bg-ink-2 p-5 text-center space-y-1">
              <div className="label text-muted">Atanan Kozmik Unvan</div>
              <div className={`display display-tight text-xl font-bold ${rankInfo.color}`}>
                {rankInfo.title}
              </div>
              <div className="label text-paper/80 mt-1">
                {rankInfo.badge} · {rankInfo.grade}
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-8 max-w-lg mx-auto border-t border-line text-xs font-mono text-muted">
              <div className="text-center">
                <div className="serif-i text-paper text-sm">AstroTR Telemetri</div>
                <div className="label text-[9px] mt-1">Gözlem Masası Şefi</div>
              </div>
              <div className="w-10 h-10 border border-violet/40 flex items-center justify-center text-violet">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="serif-i text-paper text-sm">Kozmik Kurul</div>
                <div className="label text-[9px] mt-1">Yetkilendirme Mührü</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="label px-6 py-3 bg-paper text-ink font-bold flex items-center gap-2 hover:bg-paper/90 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Sertifikayı Yazdır / PDF Kaydet</span>
            </button>
            <button
              onClick={handleRestart}
              className="label px-6 py-3 border border-line bg-ink-2 text-paper/80 flex items-center gap-2 hover:bg-ink-3 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Testi Baştan Başlat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
