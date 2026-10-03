"""Film seslendirmesi: metin.json'daki her satırı XTTS v2 ile (referans sesi klonlayarak) seslendirir.

Her satır için birkaç deneme üretilir; Whisper ile yazıya dökülür. Metni doğru okuyan denemeler arasından
tonlaması en canlı olan (perdesi en çok oynayan) seçilir: tekdüze okuma "yapay zekâ" gibi duyulur.
Sonuç: video/_ses/<senaryo>/<id>.wav  (+ metin.json'da "koro" varsa vokoder koro kaynağı: koro.mp3)

Kullanım (XTTS kurulu Python ile):
  <venv>/python tools/film/seslendir.py tools/film/retro/metin.json <referans.wav>
  <venv>/python tools/film/seslendir.py tools/film/retro/metin.json --edge tr-TR-AhmetNeural   (Microsoft sesi, internet ister)
Seçenekler: --deneme 3  --hiz 1.05  --sicaklik 0.7  --sadece 03-anadolu,05-kasa
            --secim   (yeniden üretmeden mevcut denemeler arasından seç)
            --ref-perde 1.5   (referansı N yarım ton tizleştir: XTTS daha neşeli bir tavır kopyalar)
            --olcut mutlu     (seçimde canlılığa ek olarak tiz/parlak okumayı ödüllendir; varsayılan: canli)
Whisper, sistemdeki Python'dan çağrılır (varsayılan: py başlatıcısı; WHISPER_PY ile değiştirilebilir).
"""
import argparse, asyncio, json, os, re, shutil, subprocess, sys, difflib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ap = argparse.ArgumentParser()
ap.add_argument("metin")
ap.add_argument("referans", nargs="?")
ap.add_argument("--edge", help="XTTS yerine Microsoft nöral ses (ör. tr-TR-AhmetNeural)")
ap.add_argument("--deneme", type=int, default=5)
ap.add_argument("--hiz", type=float, default=1.05)
ap.add_argument("--sicaklik", type=float, default=0.85)
ap.add_argument("--sadece", default="")
ap.add_argument("--secim", action="store_true")
ap.add_argument("--ref-perde", type=float, default=0)
ap.add_argument("--olcut", choices=["canli", "mutlu"], default="canli")
a = ap.parse_args()
if not a.referans and not a.edge and not a.secim:
    sys.exit("Referans ses dosyası ya da --edge <ses> gerekli.")

scene = os.path.basename(os.path.dirname(os.path.abspath(a.metin)))
meta = json.load(open(a.metin, encoding="utf-8"))
lines = meta["satirlar"]
if a.sadece:
    keep = set(a.sadece.split(","))
    lines = [l for l in lines if l["id"] in keep]
out = os.path.join(ROOT, "video", "_ses", scene)
takes = os.path.join(out, "denemeler")
os.makedirs(takes, exist_ok=True)
say = lambda l: l.get("okunus", l["metin"]).replace("…", ", ").replace("...", ", ").strip(" ,")

# Vokoder koro kaynağı: heceler tek tek, yavaş okunur (sesin kimliği önemsiz, yalnızca ağız şekilleri kullanılır)
if meta.get("koro") and not a.sadece and not a.secim and not os.path.exists(os.path.join(out, "koro.mp3")):
    try:
        import edge_tts
        k = meta["koro"]
        asyncio.run(edge_tts.Communicate(k["heceler"], k.get("ses", "tr-TR-AhmetNeural"), rate="-15%").save(os.path.join(out, "koro.mp3")))
        print("✓ koro kaynağı", flush=True)
    except Exception as e:  # internet yoksa koro atlanır, müzik enstrümantal kalır
        print("⚠ koro kaynağı üretilemedi:", e, flush=True)

# 1) Denemeleri üret
if a.secim:
    pass
elif a.edge:
    import edge_tts
    rate = f"{round((a.hiz - 1) * 100):+d}%"
    trim = "silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.06,areverse"
    async def run():
        for l in lines:
            # Cümle ortasındaki "…" gerçek bir es olsun: parçalar ayrı seslendirilip araya 0.32 sn sessizlik konur
            parts = [p.strip(" ,") for p in l["metin"].split("…") if p.strip(" ,.")]
            if len(parts) < 2:
                await edge_tts.Communicate(say(l), a.edge, rate=rate).save(os.path.join(takes, f"{l['id']}-1.mp3"))
            else:
                tmp = []
                for j, p in enumerate(parts):
                    tmp.append(os.path.join(takes, f"_{l['id']}-p{j}.mp3"))
                    await edge_tts.Communicate(p, a.edge, rate=rate).save(tmp[-1])
                chain = "".join(f"[{j}]{trim},apad=pad_dur=0.32[p{j}];" for j in range(len(parts)))
                cat = "".join(f"[p{j}]" for j in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1"
                subprocess.run(["ffmpeg", "-y", "-v", "error", *sum([["-i", t] for t in tmp], []), "-filter_complex", chain + cat,
                                os.path.join(takes, f"{l['id']}-1.wav")], check=True)
                for t in tmp: os.remove(t)
            print("✓", l["id"], flush=True)
    asyncio.run(run())
    n_takes = 1
else:
    os.environ["COQUI_TOS_AGREED"] = "1"
    import torch, soundfile as sf
    from TTS.api import TTS
    dev = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"XTTS yükleniyor ({dev})…", flush=True)
    m = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(dev).synthesizer.tts_model
    ref = os.path.abspath(a.referans)
    if a.ref_perde:  # neşeli referans: perde (ve ağız tınısı) yukarı, tempo biraz hızlı
        ref = os.path.join(takes, "_referans.wav")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.abspath(a.referans), "-af",
                        f"rubberband=pitch={2 ** (a.ref_perde / 12):.4f}:tempo=1.05:formant=shifted", ref], check=True)
    lat, emb = m.get_conditioning_latents(audio_path=[ref])
    for l in lines:
        for k in range(1, a.deneme + 1):
            torch.manual_seed(1000 * k + len(say(l)))
            o = m.inference(text=say(l).replace(", ", "... ", 1) if "…" in l.get("okunus", l["metin"]) else say(l), language="tr", gpt_cond_latent=lat, speaker_embedding=emb,
                            temperature=a.sicaklik, speed=a.hiz, enable_text_splitting=False)
            sf.write(os.path.join(takes, f"{l['id']}-{k}.wav"), o["wav"], samplerate=24000)
        print("✓", l["id"], f"({a.deneme} deneme)", flush=True)
    n_takes = a.deneme

# 2) Whisper ile yazıya dök, metne en yakın denemeyi seç
files = [os.path.join(takes, f) for f in sorted(os.listdir(takes)) if any(f.startswith(l["id"] + "-") for l in lines)]
# Not: "python" yazılırsa Windows önce bu (XTTS) ortamın kendi python'unu bulur; whisper orada yok
wpy = os.environ.get("WHISPER_PY") or (shutil.which("py") and "py") or "python"
code = r"""
import sys, json, whisper, torch
m = whisper.load_model('medium', device='cuda' if torch.cuda.is_available() else 'cpu')
print(json.dumps({f: m.transcribe(f, language='tr', fp16=torch.cuda.is_available())['text'] for f in sys.argv[1:]}, ensure_ascii=False))
"""
# Önbellek: yazıya dökülmüş denemeler (dosya adı + değişme zamanı) tekrar dökülmez
cache_f = os.path.join(takes, "_whisper.json")
cache = json.load(open(cache_f, encoding="utf-8")) if os.path.exists(cache_f) else {}
chain = meta.get("ses_zinciri", "")
import hashlib
key = lambda f: f"{os.path.basename(f)}|{int(os.path.getmtime(f))}|{hashlib.md5(chain.encode()).hexdigest()[:8]}"
def processed(f):  # anlaşılırlık, sesin son (işlenmiş) hâli üzerinden ölçülür
    if not chain: return f
    d = os.path.join(takes, "_islenmis"); os.makedirs(d, exist_ok=True)
    p = os.path.join(d, os.path.splitext(os.path.basename(f))[0] + ".wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af", chain, "-ar", "16000", p], check=True)
    return p
todo = [f for f in files if key(f) not in cache]
heard = {f: cache[key(f)] for f in files if key(f) in cache}
if todo:
    print(f"Whisper: {len(todo)} deneme yazıya dökülüyor ({len(files) - len(todo)} önbellekten)…", flush=True)
    try:
        src = {processed(f): f for f in todo}
        r = subprocess.run([wpy, "-c", code, *src], capture_output=True, text=True, encoding="utf-8", env={**os.environ, "PYTHONIOENCODING": "utf-8"})
        new = {src[p]: t for p, t in json.loads(r.stdout.strip().splitlines()[-1]).items()}
        heard.update(new)
        cache.update({key(f): t for f, t in new.items()})
        json.dump(cache, open(cache_f, "w", encoding="utf-8"), ensure_ascii=False)
    except Exception as e:
        print("Whisper çalışmadı:", e, (r.stderr or "")[-400:] if "r" in dir() else "")
if len(heard) < len(files):
    heard = {}  # eksik kalırsa doğruluk ölçülemez: seçim yalnızca perdeye göre yapılır

def norm(s):
    s = s.lower().replace("i̇", "i").replace("â", "a").replace("î", "i").replace("û", "u")
    return re.sub(r"[^a-zçğıöşü0-9 ]", "", re.sub(r"\s+", " ", s)).strip()

def pitch(f):  # (perde oynaklığı yarım ton, medyan perde Hz); tekdüze okuma düşük oynaklık verir
    try:
        import librosa, numpy as np
        y, sr = librosa.load(f, sr=16000)
        f0, voiced, _ = librosa.pyin(y, fmin=65, fmax=420, sr=sr)
        f0 = f0[voiced & ~np.isnan(f0)]
        return (float(np.std(12 * np.log2(f0 / np.median(f0)))), float(np.median(f0))) if len(f0) > 10 else (0.0, 1.0)
    except Exception:
        return (0.0, 1.0)

acc = lambda l, f: difflib.SequenceMatcher(None, norm(say(l)), norm(heard.get(f, ""))).ratio() if heard else 0
import math
# 1) Her satırda metni doğru okuyanlar (en iyisi kusursuzsa yalnızca kusursuza yakınlar)
oks = {}
for l in lines:
    cand = sorted(f for f in files if os.path.basename(f).startswith(l["id"] + "-"))
    top = max(acc(l, f) for f in cand)
    oks[l["id"]] = [f for f in cand if acc(l, f) >= top - (0.02 if top >= 0.98 else 0.06)]
pp = {f: pitch(f) for fs_ in oks.values() for f in fs_}
# 2) Ortak perde: bütün satırlar aynı kişinin sesi gibi dursun (ortanca perdeden 2.5 yarım tondan fazla sapan cezalanır)
meds = sorted(math.log2(p[1]) for p in pp.values())
center = meds[len(meds) // 2] if meds else 0
def puan(f):
    semi = 12 * (math.log2(pp[f][1]) - center)
    s_ = pp[f][0] - 0.9 * max(0, abs(semi) - 2.5)
    return s_ + (0.4 * min(semi, 2.5) if a.olcut == "mutlu" else 0)  # mutlu: banda kadar tiz okuma ödüllendirilir
report = []
for l in lines:
    ok = oks[l["id"]]
    live = {f: puan(f) for f in ok}
    best = max(ok, key=lambda f: live[f])
    score = acc(l, best)
    dst = os.path.join(out, l["id"] + os.path.splitext(best)[1])
    for ext in (".wav", ".mp3"):  # eski seçimi temizle
        if os.path.exists(os.path.join(out, l["id"] + ext)): os.remove(os.path.join(out, l["id"] + ext))
    shutil.copy2(best, dst)
    flag = "" if score >= 0.9 or not heard else "   ⚠ kontrol et"
    report.append(f"{l['id']}: %{round(score * 100)}  puan {live[best]:.1f} ({round(pp[best][1])} Hz)  ({os.path.basename(best)})  «{heard.get(best, '').strip()}»{flag}")
print("\n".join(report))
print(f"\nSeçilenler: {os.path.relpath(out, ROOT)}  →  sonra: npm run film:ses")
