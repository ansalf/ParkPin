import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

VIDEO_PATH = "motion/output/ParkPin-Cinematic-Launch-V2.mp4"
OUTPUT_DIR = "motion/output"
TMP_DIR = "motion/output/frames_tmp"

SCENES = [
    {
        "num": "01",
        "title": "THE PROBLEM",
        "time": "00:02.5",
        "desc": "Oversized 'Where did I park?' with scattered floating floor tokens converging to pin",
        "file": "sc1.png"
    },
    {
        "num": "02",
        "title": "PRODUCT REVEAL",
        "time": "00:06.5",
        "desc": "Meet ParkPin — 3D titanium smartphone entrance with cinematic lighting & logo morph",
        "file": "sc2.png"
    },
    {
        "num": "03",
        "title": "PIN YOUR SPOT",
        "time": "00:11.5",
        "desc": "Tactile form entry with 3D breakout cards for Floor B2, Zone Blue, and Slot C-14",
        "file": "sc3.png"
    },
    {
        "num": "04",
        "title": "REMEMBER THE LANDMARK",
        "time": "00:18.5",
        "desc": "Camera shutter flash & expanding 3D photo card for Pillar P-42 & main elevator",
        "file": "sc4.png"
    },
    {
        "num": "05",
        "title": "FIND YOUR VEHICLE",
        "time": "00:25.5",
        "desc": "Live 360° Compass HUD, real-time distance countdown (58m -> 0m), and floor prompt",
        "file": "sc5.png"
    },
    {
        "num": "06",
        "title": "FEATURE SHOWCASE",
        "time": "00:32.5",
        "desc": "3-Phone perspective layout: Parking History, Live Landmark, and 100% Offline Mode",
        "file": "sc6.png"
    },
    {
        "num": "07",
        "title": "BRAND FINALE",
        "time": "00:41.0",
        "desc": "Rhythmic kinetic typography 'Park. Pin. Find.' with final logo lockup & Install CTA",
        "file": "sc7.png"
    }
]

def main():
    os.makedirs(TMP_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Extracting representative frames...")
    for sc in SCENES:
        out_frame = os.path.join(TMP_DIR, sc["file"])
        cmd = [
            "/opt/homebrew/bin/ffmpeg",
            "-y",
            "-ss", sc["time"],
            "-i", VIDEO_PATH,
            "-vframes", "1",
            "-q:v", "2",
            out_frame
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Extracted {sc['title']} at {sc['time']}")

    # Thumbnail generation (using Scene 2 / Scene 7)
    thumb_src = os.path.join(TMP_DIR, "sc2.png")
    thumb_dst = os.path.join(OUTPUT_DIR, "ParkPin-Cinematic-Thumbnail-V2.png")
    if os.path.exists(thumb_src):
        img_thumb = Image.open(thumb_src)
        img_thumb.save(thumb_dst, "PNG")
        print(f"Saved Thumbnail: {thumb_dst}")

    # Generate Storyboard Contact Sheet (2 rows x 4 columns = 8 cards, 7 scenes + 1 spec card)
    card_w = 640
    card_h = 360
    pad_x = 40
    pad_y = 30
    margin_top = 180
    margin_side = 50

    total_w = margin_side * 2 + card_w * 4 + pad_x * 3 # 2730
    total_h = margin_top + card_h * 2 + pad_y * 1 + 140 # 1070

    board = Image.new("RGB", (total_w, total_h), color="#0F1819")
    draw = ImageDraw.Draw(board)

    # Top Brand Header
    draw.rectangle([(0, 0), (total_w, 140)], fill="#1A2C2E")
    # Top Gold accent line
    draw.line([(0, 140), (total_w, 140)], fill="#D9BFA3", width=3)

    # Header texts (fallback to default font if custom font not available)
    try:
        font_logo = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 34)
        font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 20)
        font_card_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 16)
        font_card_desc = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
        font_badge = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 12)
    except:
        font_logo = font_title = font_card_title = font_card_desc = font_badge = ImageFont.load_default()

    draw.text((margin_side, 35), "PARKPIN", fill="#F5F3EE", font=font_logo)
    draw.text((margin_side + 175, 43), "•  CINEMATIC LAUNCH STORYBOARD V2", fill="#D9BFA3", font=font_title)
    draw.text((margin_side, 88), "43.0 SECONDS  |  60 FPS  |  1920 × 1080 MASTER  |  7-SCENE NARRATIVE ARC", fill="#789B9A", font=font_card_desc)

    # Status pill on right
    draw.rectangle([(total_w - margin_side - 200, 48), (total_w - margin_side, 92)], fill="#243B3D", outline="#789B9A", width=1)
    draw.text((total_w - margin_side - 180, 60), "STATUS: APPROVED V2", fill="#10B981", font=font_badge)

    # Place the 7 scenes
    for i, sc in enumerate(SCENES):
        col = i % 4
        row = i // 4

        x = margin_side + col * (card_w + pad_x)
        y = margin_top + row * (card_h + pad_y + 70)

        frame_path = os.path.join(TMP_DIR, sc["file"])
        if os.path.exists(frame_path):
            img = Image.open(frame_path).resize((card_w, card_h), Image.Resampling.LANCZOS)
            board.paste(img, (x, y))

            # Border around frame
            draw.rectangle([(x, y), (x + card_w, y + card_h)], outline="#243B3D", width=2)

            # Scene badge overlay on frame
            draw.rectangle([(x + 12, y + 12), (x + 110, y + 36)], fill="#243B3D")
            draw.text((x + 20, y + 17), f"SCENE {sc['num']}", fill="#D9BFA3", font=font_badge)

            # Timecode overlay
            draw.rectangle([(x + card_w - 75, y + 12), (x + card_w - 12, y + 36)], fill="#0F1819")
            draw.text((x + card_w - 68, y + 17), sc["time"], fill="#F5F3EE", font=font_badge)

            # Metadata below card
            draw.text((x, y + card_h + 12), f"SCENE {sc['num']} — {sc['title']}", fill="#F5F3EE", font=font_card_title)
            draw.text((x, y + card_h + 36), sc["desc"][:85] + ("..." if len(sc["desc"]) > 85 else ""), fill="#789B9A", font=font_card_desc)

    # Card 8: Technical Specs & Audio-Visual Blueprint
    col = 7 % 4
    row = 7 // 4
    x = margin_side + col * (card_w + pad_x)
    y = margin_top + row * (card_h + pad_y + 70)

    draw.rectangle([(x, y), (x + card_w, y + card_h)], fill="#1A2C2E", outline="#D9BFA3", width=2)
    draw.text((x + 30, y + 30), "PRODUCTION SPECIFICATIONS", fill="#D9BFA3", font=font_card_title)
    
    specs = [
        "Composition: ParkPinCinematicLaunchV2",
        "Resolution: 1920 × 1080 (16:9 Landscape)",
        "Social Cut: 1080 × 1920 (9:16 Vertical)",
        "Frame Rate: 60 FPS (Butter Smooth)",
        "Total Frames: 2580 frames (43.00s)",
        "Encoder: Native arm64 H.264 / AAC",
        "Color Palette: Deep Teal, Warm Ivory, Sand",
        "PWA Compatibility: iOS, Android, Desktop"
    ]
    for idx, spec in enumerate(specs):
        draw.text((x + 30, y + 70 + idx * 30), f"• {spec}", fill="#E2ECE9", font=font_card_desc)

    # Save final storyboard image
    storyboard_dst = os.path.join(OUTPUT_DIR, "ParkPin-Cinematic-Storyboard-V2.png")
    board.save(storyboard_dst, "PNG")
    print(f"Saved Storyboard Contact Sheet: {storyboard_dst}")

if __name__ == "__main__":
    main()
