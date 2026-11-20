import os
import wave
import struct
import math
import numpy as np
import subprocess

SAMPLE_RATE = 44100

def write_wav(filename, samples):
    # Ensure -1.0 to 1.0 bounds
    max_val = np.max(np.abs(samples))
    if max_val > 0.98:
        samples = samples * (0.98 / max_val)
    int_samples = np.int16(samples * 32767)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(2) # Stereo
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        
        # Interleave stereo
        stereo = np.empty((len(samples), 2), dtype=np.int16)
        stereo[:, 0] = int_samples
        stereo[:, 1] = int_samples
        wav_file.writeframes(stereo.tobytes())

def generate_sfx():
    os.makedirs("motion/public/audio/sfx", exist_ok=True)
    
    # 1. Tap SFX (Subtle tactile click, 45ms)
    t = np.linspace(0, 0.045, int(SAMPLE_RATE * 0.045), endpoint=False)
    click = np.sin(2 * np.pi * 1400 * t) * np.exp(-t * 180)
    thud = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 90) * 0.6
    tap = (click + thud) * 0.7
    write_wav("/tmp/tap.wav", tap)
    subprocess.run(["/opt/homebrew/bin/ffmpeg", "-y", "-i", "/tmp/tap.wav", "-b:a", "192k", "motion/public/audio/sfx/tap.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Generated sfx/tap.mp3")

    # 2. Transition SFX (Soft air sweep, 280ms)
    dur = 0.28
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    # Bandpassed filtered noise sweep
    noise = np.random.normal(0, 1, len(t))
    env = np.sin(np.pi * t / dur) ** 2
    carrier = np.sin(2 * np.pi * (250 + 400 * (t / dur)) * t)
    trans = (noise * 0.3 + carrier * 0.4) * env * 0.45
    write_wav("/tmp/trans.wav", trans)
    subprocess.run(["/opt/homebrew/bin/ffmpeg", "-y", "-i", "/tmp/trans.wav", "-b:a", "192k", "motion/public/audio/sfx/transition.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Generated sfx/transition.mp3")

    # 3. Success SFX (Gentle dual-tone chime: E5 659Hz -> A5 880Hz, 650ms)
    dur = 0.65
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    chime1 = np.sin(2 * np.pi * 659.25 * t) * np.exp(-t * 12)
    chime2 = np.zeros_like(t)
    offset = int(SAMPLE_RATE * 0.12)
    t2 = t[offset:] - t[offset]
    chime2[offset:] = (np.sin(2 * np.pi * 880 * t2) + 0.3 * np.sin(2 * np.pi * 1760 * t2)) * np.exp(-t2 * 9)
    success = (chime1 * 0.6 + chime2 * 0.8) * 0.6
    write_wav("/tmp/success.wav", success)
    subprocess.run(["/opt/homebrew/bin/ffmpeg", "-y", "-i", "/tmp/success.wav", "-b:a", "192k", "motion/public/audio/sfx/success.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Generated sfx/success.mp3")

    # 4. Shutter SFX (Crisp double mechanical click, 180ms)
    dur = 0.18
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    click1 = np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 220)
    click2 = np.zeros_like(t)
    off = int(SAMPLE_RATE * 0.055)
    t_sub = t[off:] - t[off]
    click2[off:] = np.sin(2 * np.pi * 1800 * t_sub) * np.exp(-t_sub * 200) * 0.85
    shutter = (click1 + click2) * 0.65
    write_wav("/tmp/shutter.wav", shutter)
    subprocess.run(["/opt/homebrew/bin/ffmpeg", "-y", "-i", "/tmp/shutter.wav", "-b:a", "192k", "motion/public/audio/sfx/shutter.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Generated sfx/shutter.mp3")

def generate_background_music():
    os.makedirs("motion/public/audio/music", exist_ok=True)
    
    # 45 seconds ambient tech track @ 80 BPM
    duration = 45.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    samples = np.zeros_like(t)
    
    # Chord progression: 4 bars loop (8 seconds per cycle)
    # Chords (frequencies in Hz):
    # 1. Dmaj7: D3(146.8), A3(220), C#4(277.2), F#4(369.9)
    # 2. Bm7:   B2(123.5), F#3(185), A3(220), D4(293.7)
    # 3. Gmaj7: G2(98), D3(146.8), F#3(185), B3(246.9)
    # 4. Asus4: A2(110), E3(164.8), A3(220), D4(293.7)
    
    chords = [
        [146.8, 220.0, 277.2, 369.9],
        [123.5, 185.0, 220.0, 293.7],
        [98.0, 146.8, 185.0, 246.9],
        [110.0, 164.8, 220.0, 293.7]
    ]
    chord_dur = 8.0 / 4.0 # 2 seconds per chord
    
    # Synthesize warm analog pads
    for chord_idx, freqs in enumerate(chords):
        for rep in range(int(duration / 8.0) + 1):
            chord_start = rep * 8.0 + chord_idx * chord_dur
            if chord_start >= duration:
                break
            chord_end = min(duration, chord_start + chord_dur + 0.4) # overlap for smooth swell
            start_idx = int(chord_start * SAMPLE_RATE)
            end_idx = int(chord_end * SAMPLE_RATE)
            seg_t = t[start_idx:end_idx] - chord_start
            
            # Envelope: smooth sine attack & decay
            seg_len = len(seg_t)
            env = np.sin(np.pi * np.linspace(0, 1, seg_len)) ** 1.5
            
            for f in freqs:
                # Add fundamental + gentle 2nd harmonic
                tone = np.sin(2 * np.pi * f * seg_t) + 0.25 * np.sin(2 * np.pi * (f * 2) * seg_t)
                samples[start_idx:end_idx] += tone * env * 0.05
    
    # Add subtle marimba / pluck arpeggio
    # Plucks happen on 8th notes (0.375s intervals)
    scale_notes = [293.7, 369.9, 440.0, 554.4, 587.3, 739.9, 880.0]
    np.random.seed(42) # Deterministic melody
    cur_time = 0.5
    while cur_time < duration - 1.5:
        note_freq = np.random.choice(scale_notes)
        note_dur = 0.4
        idx = int(cur_time * SAMPLE_RATE)
        end_idx = min(len(t), idx + int(note_dur * SAMPLE_RATE))
        note_t = t[idx:end_idx] - cur_time
        pluck = (np.sin(2 * np.pi * note_freq * note_t) + 0.2 * np.sin(4 * np.pi * note_freq * note_t)) * np.exp(-note_t * 14)
        samples[idx:end_idx] += pluck * 0.04
        cur_time += 0.375
    
    # Add warm heartbeat sub-pulse (every 1.5s)
    beat_time = 0.0
    while beat_time < duration:
        idx = int(beat_time * SAMPLE_RATE)
        end_idx = min(len(t), idx + int(0.2 * SAMPLE_RATE))
        beat_t = t[idx:end_idx] - beat_time
        sub = np.sin(2 * np.pi * 55 * beat_t) * np.exp(-beat_t * 20)
        samples[idx:end_idx] += sub * 0.06
        beat_time += 1.5

    # Overall track fade in (first 2s) and fade out (last 3s)
    fade_in_len = int(2.0 * SAMPLE_RATE)
    samples[:fade_in_len] *= np.linspace(0, 1, fade_in_len)
    fade_out_len = int(3.5 * SAMPLE_RATE)
    samples[-fade_out_len:] *= np.linspace(1, 0, fade_out_len)
    
    write_wav("/tmp/music.wav", samples)
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y",
        "-i", "/tmp/music.wav",
        "-af", "loudnorm=I=-22:TP=-2.0:LRA=7",
        "-ar", "44100",
        "-b:a", "192k",
        "motion/public/audio/music/background.mp3"
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Generated music/background.mp3")

if __name__ == "__main__":
    generate_sfx()
    generate_background_music()
