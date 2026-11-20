import React from 'react'

export interface PhoneMockup3DProps {
  children: React.ReactNode
  width?: number
  height?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  translateZ?: number
  elevation?: number
  scale?: number
  shadowIntensity?: number
  glareOpacity?: number
  style?: React.CSSProperties
}

export const PhoneMockup3D: React.FC<PhoneMockup3DProps> = ({
  children,
  width = 390,
  height = 800,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  translateZ = 0,
  elevation,
  scale = 1,
  shadowIntensity = 0.45,
  glareOpacity = 0.15,
  style = {}
}) => {
  const actualZ = elevation !== undefined ? elevation : translateZ
  // Shadow moves slightly in opposite direction of tilt
  const shadowOffsetX = -rotateY * 1.5
  const shadowOffsetY = 30 + rotateX * 1.2
  const shadowBlur = 70 + Math.abs(rotateX) + Math.abs(rotateY) * 2

  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        transformStyle: 'preserve-3d',
        transform: `scale(${scale}) translateZ(${actualZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        willChange: 'transform',
        ...style
      }}
    >
      {/* Dynamic Device Drop Shadow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '52px',
          boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px -10px rgba(15, 26, 27, ${shadowIntensity}), 0 10px 20px -5px rgba(0, 0, 0, 0.25)`,
          pointerEvents: 'none'
        }}
      />

      {/* Titanium Outer Chassis */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '52px',
          backgroundColor: '#1E292B',
          padding: '11px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: 'inset 0 0 0 2px rgba(36, 59, 61, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Dynamic Island Pill */}
        <div
          style={{
            position: 'absolute',
            top: '19px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '108px',
            height: '26px',
            backgroundColor: '#0F1A1B',
            borderRadius: '18px',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Subtle sensor camera dots */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#1C3133',
              border: '1px solid #2B4547'
            }}
          />
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#162729',
              border: '1px solid #223739'
            }}
          />
        </div>

        {/* Viewport Screen Content */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '42px',
            backgroundColor: '#F5F3EE',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </div>

        {/* Diagonal Screen Glass Glare / Sheen */}
        {glareOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 60%)',
              pointerEvents: 'none',
              transform: `translate(${rotateY * 3}px, ${rotateX * 3}px)`,
              opacity: glareOpacity,
              borderRadius: '52px'
            }}
          />
        )}
      </div>
    </div>
  )
}
