import React from 'react'
import { useCurrentFrame } from 'remotion'

export interface SubtitleCue {
  startFrame: number
  endFrame: number
  text: string
}

const CUES: SubtitleCue[] = [
  // Scene 01 (0 - 240)
  {
    startFrame: 15,
    endFrame: 190,
    text: 'Never forget where you parked. Meet ParkPin.'
  },
  // Scene 02 (240 - 720)
  {
    startFrame: 255,
    endFrame: 468,
    text: 'When you park, simply open ParkPin and save your parking location.'
  },
  {
    startFrame: 474,
    endFrame: 682,
    text: 'Add your floor, zone, and parking slot.'
  },
  // Scene 03 (720 - 1080)
  {
    startFrame: 735,
    endFrame: 928,
    text: 'Add a photo or a note to remember the details that matter.'
  },
  // Scene 04 (1080 - 1560)
  {
    startFrame: 1095,
    endFrame: 1272,
    text: 'Ready to leave? Open your saved parking location...'
  },
  {
    startFrame: 1278,
    endFrame: 1449,
    text: '...and find the details you need to get back to your vehicle.'
  },
  // Scene 05 (1560 - 1920)
  {
    startFrame: 1575,
    endFrame: 1824,
    text: 'Keep track of your previous parking locations, all in one place.'
  },
  // Scene 06 (1920 - 2280)
  {
    startFrame: 1940,
    endFrame: 2070,
    text: 'Park. Pin. Find.'
  },
  {
    startFrame: 2076,
    endFrame: 2206,
    text: 'Your parking spot, remembered.'
  }
]

export const SubtitlesOverlay: React.FC = () => {
  const frame = useCurrentFrame()

  // Find active cue
  const activeCue = CUES.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  )

  if (!activeCue) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '52px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '0 40px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(15, 24, 25, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(217, 191, 163, 0.35)',
          color: '#F5F3EE',
          padding: '12px 28px',
          borderRadius: '18px',
          fontSize: '22px',
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          maxWidth: '880px',
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}
      >
        {activeCue.text}
      </div>
    </div>
  )
}
