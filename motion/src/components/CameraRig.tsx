import React from 'react'

export interface CameraRigProps {
  children: React.ReactNode
  x?: number
  y?: number
  z?: number
  panX?: number
  panY?: number
  dollyZ?: number
  scale?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  perspective?: number
  style?: React.CSSProperties
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  x = 0,
  y = 0,
  z = 0,
  panX,
  panY,
  dollyZ,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  perspective = 1400,
  style = {}
}) => {
  const finalX = panX !== undefined ? panX : x
  const finalY = panY !== undefined ? panY : y
  const finalZ = dollyZ !== undefined ? dollyZ : z

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `translate3d(${finalX}px, ${finalY}px, ${finalZ}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {children}
      </div>
    </div>
  )
}
