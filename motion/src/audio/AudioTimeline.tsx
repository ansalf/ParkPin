import React from 'react'
import { Audio, staticFile, useCurrentFrame, interpolate } from 'remotion'

export interface AudioTimelineProps {
  includeCaptions?: boolean
}

// Global narration windows for music ducking (in 60 FPS frames)
const NARRATION_WINDOWS = [
  { start: 15, end: 190 },     // 01-introduction
  { start: 255, end: 682 },    // 02-save-parking
  { start: 735, end: 928 },    // 03-landmark
  { start: 1095, end: 1449 },  // 04-find-vehicle
  { start: 1575, end: 1824 },  // 05-history
  { start: 1940, end: 2206 }   // 06-closing
]

export const AudioTimeline: React.FC<AudioTimelineProps> = () => {
  const frame = useCurrentFrame()

  // Calculate dynamic ducked music volume
  const getMusicVolume = (f: number) => {
    // Fade in over first 60 frames (1.0s)
    if (f < 60) {
      return interpolate(f, [0, 60], [0, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    }
    // Fade out over last 90 frames (1.5s, ends at frame 2280)
    if (f > 2190) {
      return interpolate(f, [2190, 2275], [0.12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    }

    // Check if within any narration window with a 15-frame smooth ramp
    for (const win of NARRATION_WINDOWS) {
      if (f >= win.start - 15 && f <= win.end + 15) {
        if (f < win.start) {
          // Ramping down into narration
          return interpolate(f, [win.start - 15, win.start], [0.12, 0.045], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }
        if (f > win.end) {
          // Ramping back up after narration
          return interpolate(f, [win.end, win.end + 15], [0.045, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }
        return 0.045 // Ducked volume during speech
      }
    }
    return 0.13 // Normal swell between scenes
  }

  return (
    <>
      {/* 1. Continuous Background Music Track */}
      <Audio
        src={staticFile('audio/music/background.mp3')}
        volume={(f) => getMusicVolume(f)}
      />

      {/* 2. Scene Narration Tracks */}
      {/* Scene 01: Introduction */}
      <Audio
        src={staticFile('audio/narration/01-introduction.mp3')}
        startFrom={0}
        volume={1.0}
      />

      {/* Scene 02: Save Parking (starts at frame 240 + 15 = 255) */}
      {frame >= 255 && (
        <Audio
          src={staticFile('audio/narration/02-save-parking.mp3')}
          startFrom={0}
          volume={1.0}
        />
      )}

      {/* Scene 03: Landmark Details (starts at frame 720 + 15 = 735) */}
      {frame >= 735 && (
        <Audio
          src={staticFile('audio/narration/03-landmark.mp3')}
          startFrom={0}
          volume={1.0}
        />
      )}

      {/* Scene 04: Find My Vehicle (starts at frame 1080 + 15 = 1095) */}
      {frame >= 1095 && (
        <Audio
          src={staticFile('audio/narration/04-find-vehicle.mp3')}
          startFrom={0}
          volume={1.0}
        />
      )}

      {/* Scene 05: History (starts at frame 1560 + 15 = 1575) */}
      {frame >= 1575 && (
        <Audio
          src={staticFile('audio/narration/05-history.mp3')}
          startFrom={0}
          volume={1.0}
        />
      )}

      {/* Scene 06: Closing (starts at frame 1920 + 20 = 1940) */}
      {frame >= 1940 && (
        <Audio
          src={staticFile('audio/narration/06-closing.mp3')}
          startFrom={0}
          volume={1.0}
        />
      )}

      {/* 3. Synchronized Sound Effects */}
      {/* Scene 01: Transition riser on phone entrance */}
      {frame >= 25 && frame < 50 && (
        <Audio src={staticFile('audio/sfx/transition.mp3')} volume={0.22} />
      )}

      {/* Scene 02: Tap on Simpan Titik (frame 240 + 48 = 288) */}
      {frame >= 288 && frame < 310 && (
        <Audio src={staticFile('audio/sfx/tap.mp3')} volume={0.35} />
      )}
      {/* Scene 02: Form transition (frame 240 + 70 = 310) */}
      {frame >= 310 && frame < 335 && (
        <Audio src={staticFile('audio/sfx/transition.mp3')} volume={0.22} />
      )}
      {/* Scene 02: Tap submit in form (frame 240 + 345 = 585) */}
      {frame >= 585 && frame < 605 && (
        <Audio src={staticFile('audio/sfx/tap.mp3')} volume={0.35} />
      )}
      {/* Scene 02: Success chime on spot saved (frame 240 + 365 = 605) */}
      {frame >= 605 && frame < 660 && (
        <Audio src={staticFile('audio/sfx/success.mp3')} volume={0.3} />
      )}

      {/* Scene 03: Tap photo (frame 720 + 35 = 755) */}
      {frame >= 755 && frame < 775 && (
        <Audio src={staticFile('audio/sfx/tap.mp3')} volume={0.35} />
      )}
      {/* Scene 03: Camera shutter click (frame 720 + 48 = 768) */}
      {frame >= 768 && frame < 795 && (
        <Audio src={staticFile('audio/sfx/shutter.mp3')} volume={0.38} />
      )}

      {/* Scene 04: Tap Cari Kendaraan (frame 1080 + 36 = 1116) */}
      {frame >= 1116 && frame < 1136 && (
        <Audio src={staticFile('audio/sfx/tap.mp3')} volume={0.35} />
      )}
      {/* Scene 04: Compass transition (frame 1080 + 65 = 1145) */}
      {frame >= 1145 && frame < 1170 && (
        <Audio src={staticFile('audio/sfx/transition.mp3')} volume={0.25} />
      )}
      {/* Scene 04: Arrival success chime (frame 1080 + 340 = 1420) */}
      {frame >= 1420 && frame < 1475 && (
        <Audio src={staticFile('audio/sfx/success.mp3')} volume={0.32} />
      )}

      {/* Scene 05: History slide transition (frame 1560 + 20 = 1580) */}
      {frame >= 1580 && frame < 1605 && (
        <Audio src={staticFile('audio/sfx/transition.mp3')} volume={0.22} />
      )}

      {/* Scene 06: Final brand lockup chime (frame 1920 + 140 = 2060) */}
      {frame >= 2060 && frame < 2120 && (
        <Audio src={staticFile('audio/sfx/success.mp3')} volume={0.35} />
      )}
    </>
  )
}
