import subprocess
import os

scripts = [
    ("01-introduction", "Never forget where you parked. Meet ParkPin.", 160),
    ("02-save-parking", "When you park, simply open ParkPin and save your parking location. Add your floor, zone, and parking slot.", 165),
    ("03-landmark", "Add a photo or a note to remember the details that matter.", 160),
    ("04-find-vehicle", "Ready to leave? Open your saved parking location and find the details you need to get back to your vehicle.", 165),
    ("05-history", "Keep track of your previous parking locations, all in one place.", 160),
    ("06-closing", "Park. Pin. Find. Your parking spot, remembered.", 150)
]

output_dir = "motion/public/audio/narration"
os.makedirs(output_dir, exist_ok=True)

for name, text, rate in scripts:
    aiff_path = f"/tmp/{name}.aiff"
    mp3_path = f"{output_dir}/{name}.mp3"
    
    # 1. Use macOS say with Samantha
    cmd_say = ["say", "-v", "Samantha", "-r", str(rate), text, "-o", aiff_path]
    subprocess.run(cmd_say, check=True)
    
    # 2. Convert with ffmpeg, normalize volume and output clean 44.1kHz stereo MP3
    cmd_ffmpeg = [
        "/opt/homebrew/bin/ffmpeg", "-y",
        "-i", aiff_path,
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,volume=1.1",
        "-ar", "44100",
        "-b:a", "192k",
        mp3_path
    ]
    subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 3. Measure duration
    cmd_probe = [
        "/opt/homebrew/bin/ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        mp3_path
    ]
    dur = subprocess.check_output(cmd_probe).decode().strip()
    print(f"Generated {name}.mp3 -> {float(dur):.2f}s ({text})")

