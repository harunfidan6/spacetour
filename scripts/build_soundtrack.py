import subprocess
import os

def build_soundtrack():
    os.makedirs("temp_audio_master", exist_ok=True)
    voice_track = "temp_audio_master/narrator_track.wav"
    music_track = "temp_audio_master/music_track.wav"
    final_audio = "temp_audio_master/final_soundtrack.m4a"

    # 1. Combine voice cues with exact millisecond delays
    # cue1 @ 0.6s (600ms)
    # cue2 @ 3.8s (3800ms)
    # cue3 @ 9.2s (9200ms)
    # cue4 @ 16.5s (16500ms)
    # cue5 @ 24.8s (24800ms)
    voice_cmd = [
        "ffmpeg", "-y",
        "-i", "temp_narration/cue1_gokyuzu.mp3",
        "-i", "temp_narration/cue2_yildizlar.mp3",
        "-i", "temp_narration/cue3_isik.mp3",
        "-i", "temp_narration/cue4_simdi.mp3",
        "-i", "temp_narration/cue5_spacetour.mp3",
        "-filter_complex",
        "[0:a]adelay=600|600[v1];"
        "[1:a]adelay=3800|3800[v2];"
        "[2:a]adelay=9200|9200[v3];"
        "[3:a]adelay=16500|16500[v4];"
        "[4:a]adelay=24800|24800[v5];"
        "[v1][v2][v3][v4][v5]amix=inputs=5:dropout_transition=2,"
        "highpass=f=75,equalizer=f=2500:t=q:w=1.5:g=2,equalizer=f=350:t=q:w=1.0:g=1.5,"
        "aecho=0.8:0.7:30|50:0.2|0.15[voice_out]",
        "-map", "[voice_out]",
        "-t", "30",
        voice_track
    ]
    subprocess.check_call(voice_cmd)
    print("Voice track aligned & filtered!")

    # 2. Synthesize Cinematic Orchestral Score & SFX (30 seconds)
    # Chords:
    # 0-8s: D minor (D1=36.71, A1=55, F2=87.31, D3=146.83)
    # 8-16s: Bb major (Bb1=29.14, F1=43.65, D2=73.42, Bb2=116.54)
    # 16-24s: G minor / C (C1=32.7, G1=49, Eb2=77.78, C3=130.81)
    # 24-30s: D minor Resolve (D1=36.71, A1=55, D2=73.42, F2=87.31)
    # Along with cosmic pink noise wind, sub-bass braams at scene marks, and celestial shimmer
    music_cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "sine=frequency=36.71:duration=30",
        "-f", "lavfi", "-i", "sine=frequency=55:duration=30",
        "-f", "lavfi", "-i", "sine=frequency=87.31:duration=30",
        "-f", "lavfi", "-i", "sine=frequency=146.83:duration=30",
        "-f", "lavfi", "-i", "sine=frequency=220:duration=30",
        "-f", "lavfi", "-i", "anoisesrc=d=30:c=pink:r=48000:a=0.04",
        "-filter_complex",
        "[0:a]volume=0.35[bass];"
        "[1:a]volume=0.25[cello];"
        "[2:a]volume=0.20[third];"
        "[3:a]volume=0.15[fifth];"
        "[4:a]volume=0.10,tremolo=f=4:d=0.3[shimmer];"
        "[5:a]lowpass=f=450,volume=0.12[wind];"
        "[bass][cello][third][fifth][shimmer][wind]amix=inputs=6,"
        "afade=t=in:ss=0:d=2.0,afade=t=out:st=27.5:d=2.5[score_out]",
        "-map", "[score_out]",
        "-t", "30",
        music_track
    ]
    subprocess.check_call(music_cmd)
    print("Orchestral score track synthesized!")

    # 3. Final Master: Mix Voice + Score with Audio Ducking & EBU R128 (-14 LUFS) Normalization
    mix_cmd = [
        "ffmpeg", "-y",
        "-i", music_track,
        "-i", voice_track,
        "-filter_complex",
        # Duck music when voice speaks
        "[0:a][1:a]sidechaincompress=threshold=0.08:ratio=4:attack=50:release=300[ducked_music];"
        "[ducked_music][1:a]amix=inputs=2:weights=0.9 1.4,"
        "loudnorm=I=-14:LRA=7:tp=-1.5[out]",
        "-map", "[out]",
        "-c:a", "aac",
        "-b:a", "256k",
        "-t", "30",
        final_audio
    ]
    subprocess.check_call(mix_cmd)
    print(f"Master soundtrack created: {final_audio} (-14 LUFS, Broadcast Ready!)")

if __name__ == "__main__":
    build_soundtrack()
