import React from 'react'

interface PhoneMockupProps {
  children: React.ReactNode
  width?: number
  height?: number
  style?: React.CSSProperties
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  width = 380,
  height = 760,
  style = {}
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '52px',
        backgroundColor: '#1A2C2E',
        padding: '12px',
        boxShadow:
          '0 30px 80px -15px rgba(26, 44, 46, 0.45), 0 10px 25px -5px rgba(0, 0, 0, 0.2), inset 0 0 0 2px rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Dynamic Island / Notch */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '24px',
          backgroundColor: '#0F1A1B',
          borderRadius: '16px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#1D3538',
            border: '1px solid #2A484C'
          }}
        />
      </div>

      {/* Screen Frame */}
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

      {/* Gloss / Bezel Highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '52px',
          pointerEvents: 'none',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      />
    </div>
  )
}
