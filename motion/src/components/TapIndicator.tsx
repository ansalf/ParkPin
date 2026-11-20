import React from 'react'
import { interpolate, useCurrentFrame, Easing } from 'remotion'

interface TapIndicatorProps {
  delayFrame?: number
  durationFrames?: number
  x?: number
  y?: number
  size?: number
}

export const TapIndicator: React.FC<TapIndicatorProps> = ({
  delayFrame = 35,
  durationFrames = 25,
  x = 0,
  y = 0,
  size = 48
}) => {
  const frame = useCurrentFrame()
  const relativeFrame = frame - delayFrame

  if (relativeFrame < 0 || relativeFrame > durationFrames) {
    return null
  }

  const opacity = interpolate(
    relativeFrame,
    [0, 5, durationFrames * 0.7, durationFrames],
    [0, 0.9, 0.4, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const scale = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0.4, 1.4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    }
  )

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 100
      }}
    >
      {/* Outer Ripple */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(36, 59, 61, 0.3)',
          border: '2px solid rgba(36, 59, 61, 0.7)',
          opacity,
          transform: `scale(${scale})`,
          boxSizing: 'border-box'
        }}
      />
      {/* Center Dot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#243B3D',
          transform: 'translate(-50%, -50%)',
          opacity
        }}
      />
    </div>
  )
}
