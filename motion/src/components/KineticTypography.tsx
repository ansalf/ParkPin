import React from 'react'
import { interpolate, useCurrentFrame, Easing } from 'remotion'

export interface KineticTextLineProps {
  text: string
  startFrame?: number
  durationFrames?: number
  staggerPerWordFrames?: number
  fontSize?: number
  fontWeight?: number | string
  color?: string
  letterSpacing?: string
  lineHeight?: number | string
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export const KineticTextLine: React.FC<KineticTextLineProps> = ({
  text,
  startFrame = 0,
  durationFrames = 25,
  staggerPerWordFrames = 4,
  fontSize = 48,
  fontWeight = 800,
  color = '#1A2C2E',
  letterSpacing = '-1px',
  lineHeight = 1.15,
  align = 'left',
  style = {}
}) => {
  const frame = useCurrentFrame()
  const words = text.split(' ')

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.3em',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        letterSpacing,
        lineHeight,
        fontFamily: 'Inter, -apple-system, sans-serif',
        ...style
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerPerWordFrames
        const progress = interpolate(
          frame,
          [wordStart, wordStart + durationFrames],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1)
          }
        )

        const translateY = interpolate(progress, [0, 1], [110, 0])
        const opacity = interpolate(progress, [0, 0.4, 1], [0, 0.8, 1])

        return (
          <span
            key={i}
            style={{
              overflow: 'hidden',
              display: 'inline-block',
              paddingBottom: '0.08em',
              verticalAlign: 'top'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${translateY}%)`,
                opacity,
                willChange: 'transform, opacity'
              }}
            >
              {word}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export interface MaskedHeadingProps {
  children?: React.ReactNode
  text?: string
  fontSize?: number | string
  color?: string
  startFrame?: number
  durationFrames?: number
  direction?: 'up' | 'down'
  style?: React.CSSProperties
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  children,
  text,
  fontSize,
  color,
  startFrame = 0,
  durationFrames = 30,
  direction = 'up',
  style = {}
}) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    }
  )

  const initialY = direction === 'up' ? 105 : -105
  const translateY = interpolate(progress, [0, 1], [initialY, 0])
  const opacity = interpolate(progress, [0, 0.25, 1], [0, 0.85, 1])

  const content = text ? (
    <h1
      style={{
        margin: 0,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize || '56px',
        fontWeight: 900,
        color: color || '#243B3D',
        letterSpacing: '-0.02em',
        lineHeight: 1.1
      }}
    >
      {text}
    </h1>
  ) : (
    children
  )

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'inline-block',
        ...style
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}%)`,
          opacity,
          willChange: 'transform, opacity'
        }}
      >
        {content}
      </div>
    </div>
  )
}
