import React from 'react'
import { interpolate, useCurrentFrame, Easing } from 'remotion'

export interface InteractionIndicatorProps {
  tapFrame?: number
  progress?: number
  isPressed?: boolean
  label?: string
  x?: number
  y?: number
  size?: number
  color?: string
  ringColor?: string
  showRing?: boolean
}

export const InteractionIndicator: React.FC<InteractionIndicatorProps> = ({
  tapFrame = 30,
  progress,
  isPressed = false,
  label,
  x = 0,
  y = 0,
  size = 54,
  color = '#243B3D',
  ringColor = 'rgba(36, 59, 61, 0.35)',
  showRing = true
}) => {
  const frame = useCurrentFrame()

  if (progress !== undefined) {
    // Mode driven by explicit progress spring / boolean isPressed
    const actualScale = Math.max(0, progress) * (isPressed ? 0.8 : 1)
    const dotOpacity = Math.min(1, Math.max(0, progress))

    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {/* Ripple ring when pressed */}
        {showRing && isPressed && (
          <div
            style={{
              position: 'absolute',
              top: `${(size * 0.55) / 2}px`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${size * 1.6}px`,
              height: `${size * 1.6}px`,
              borderRadius: '50%',
              border: `2.5px solid ${color}`,
              opacity: 0.5,
              animation: 'none'
            }}
          />
        )}

        {/* Touch indicator dot */}
        <div
          style={{
            width: `${size * 0.55}px`,
            height: `${size * 0.55}px`,
            borderRadius: '50%',
            backgroundColor: color,
            border: '2px solid rgba(255, 255, 255, 0.9)',
            boxShadow: `0 4px 14px ${ringColor}`,
            transform: `scale(${actualScale})`,
            opacity: dotOpacity,
            boxSizing: 'border-box'
          }}
        />

        {label && (
          <div
            style={{
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              opacity: dotOpacity,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {label}
          </div>
        )}
      </div>
    )
  }

  // Otherwise frame-based mode
  const rel = frame - tapFrame
  if (rel < -15 || rel > 35) return null

  const arrivalProgress = interpolate(rel, [-15, 0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })

  const pressScale = interpolate(rel, [0, 4, 12], [1, 0.78, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  const rippleProgress = interpolate(rel, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.6, 2.2])
  const rippleOpacity = interpolate(rippleProgress, [0, 0.2, 0.8, 1], [0, 0.8, 0.3, 0])

  const dotOpacity = interpolate(rel, [-15, -5, 20, 35], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 120
      }}
    >
      {showRing && rel >= 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${size}px`,
            height: `${size}px`,
            marginLeft: `-${size / 2}px`,
            marginTop: `-${size / 2}px`,
            borderRadius: '50%',
            border: `2.5px solid ${color}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            boxSizing: 'border-box'
          }}
        />
      )}

      <div
        style={{
          width: `${size * 0.55}px`,
          height: `${size * 0.55}px`,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid rgba(255, 255, 255, 0.85)',
          boxShadow: `0 4px 14px ${ringColor}`,
          transform: `scale(${arrivalProgress * pressScale})`,
          opacity: dotOpacity,
          boxSizing: 'border-box'
        }}
      />
    </div>
  )
}
