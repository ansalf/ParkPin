import React from 'react'

export interface FloatingUICardProps {
  children: React.ReactNode
  x?: number
  y?: number
  z?: number
  scale?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  opacity?: number
  width?: number | string
  height?: number | string
  elevation?: number
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: string | number
  glowColor?: string
  style?: React.CSSProperties
}

export const FloatingUICard: React.FC<FloatingUICardProps> = ({
  children,
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  opacity = 1,
  width,
  height,
  elevation = 20,
  backgroundColor = '#FFFFFF',
  borderColor = '#E5E1D8',
  borderRadius = 22,
  padding = '16px',
  glowColor,
  style = {}
}) => {
  const shadowY = elevation * 0.8
  const shadowBlur = elevation * 1.6
  const shadowAlpha = Math.min(0.35, 0.08 + elevation * 0.008)
  const actualShadow = glowColor
    ? `0 ${shadowY}px ${shadowBlur}px ${glowColor}`
    : `0 ${shadowY}px ${shadowBlur}px rgba(36, 59, 61, ${shadowAlpha})`

  return (
    <div
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding,
        border: `1px solid ${borderColor}`,
        boxShadow: actualShadow,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        opacity,
        boxSizing: 'border-box',
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </div>
  )
}
