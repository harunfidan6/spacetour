import asyncio
import edge_tts
import os

VOICE = "tr-TR-AhmetNeural"

# Fine-tuned pacing for documentary narration
CUES = [
    # Cue 1 (0.8s): Introduction
    ("cue1_gokyuzu.mp3", "Gökyüzü hiç durmadı.", "-4%", "-2Hz"),
    # Cue 2 (4.0s): Scale & Movement
    ("cue2_yildizlar.mp3", "Yıldızlar yer değiştirdi, gezegenler yollarını çizdi.", "-5%", "-2Hz"),
    # Cue 3 (9.0s): Deep Time
    ("cue3_isik.mp3", "Işık milyarlarca yıl yol aldı.", "-5%", "-2Hz"),
    # Cue 4 (17.5s): Convergence
    ("cue4_simdi.mp3", "Şimdi hepsi tek bir yerde.", "-4%", "-2Hz"),
    # Cue 5 (25.0s): Identity & Slogan
    ("cue5_spacetour.mp3", "Spacetour. Evren hiç durmaz.", "-6%", "-3Hz")
]

async def main():
    os.makedirs("temp_narration", exist_ok=True)
    for filename, text, rate, pitch in CUES:
        out_path = os.path.join("temp_narration", filename)
        comm = edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch)
        await comm.save(out_path)
        print(f"Generated: {out_path} -> '{text}'")

if __name__ == "__main__":
    asyncio.run(main())
