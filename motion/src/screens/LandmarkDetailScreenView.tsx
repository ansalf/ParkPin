import React from 'react'

export interface LandmarkDetailScreenViewProps {
  floor?: string
  zone?: string
  slot?: string
  elapsedTime?: string
  photoUrl?: string
  locatePressed?: boolean
}

export const LandmarkDetailScreenView: React.FC<LandmarkDetailScreenViewProps> = ({
  floor = 'B2',
  zone = 'Blue',
  slot = 'C-14',
  elapsedTime = '42m',
  photoUrl,
  locatePressed = false
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F3EE',
        color: '#1A2C2E',
        fontFamily: 'Inter, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 24px 6px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#243B3D'
        }}
      >
        <span>20:22</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
          <span>97%</span>
        </div>
      </div>

      {/* Top Bar with Live Tag */}
      <div
        style={{
          padding: '8px 18px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(229, 225, 216, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '13px'
            }}
          >
            P
          </div>
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#243B3D' }}>
            ParkPin
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#E2ECE9',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#243B3D'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }}
          />
          Parkir Aktif • {elapsedTime}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Main Photo Card */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#243B3D',
            height: '210px',
            boxShadow: '0 12px 30px rgba(36, 59, 61, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '14px'
          }}
        >
          {/* Stylized background representing parking garage pillar */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: photoUrl
                ? `url(${photoUrl}) center/cover no-repeat`
                : 'linear-gradient(145deg, #1A2C2E 0%, #243B3D 60%, #355355 100%)',
              zIndex: 0
            }}
          />

          {/* Concrete / pillar overlay illustration */}
          {!photoUrl && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.15,
                backgroundImage:
                  'radial-gradient(#F5F3EE 1px, transparent 1px), radial-gradient(#F5F3EE 1px, #1A2C2E 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
                zIndex: 1
              }}
            />
          )}

          {/* Pillar badge overlay */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(26, 44, 46, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(245, 243, 238, 0.2)',
                color: '#F5F3EE',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📸</span>
              <span>Foto Landmark</span>
            </div>

            <div
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800
              }}
            >
              Zona {zone}
            </div>
          </div>

          {/* Pillar Graphic in center */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(245, 243, 238, 0.95)',
              padding: '12px 24px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              border: '2px solid #243B3D'
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: '#789B9A',
                fontWeight: 800,
                letterSpacing: '0.1em'
              }}
            >
              PILAR PATOKAN
            </span>
            <span
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#243B3D',
                lineHeight: 1.1
              }}
            >
              P-42
            </span>
            <span
              style={{
                fontSize: '9px',
                color: '#2563EB',
                fontWeight: 700,
                marginTop: '2px'
              }}
            >
              LIFT LOBI UTAMA
            </span>
          </div>

          {/* Bottom badge */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              backgroundColor: 'rgba(26, 44, 46, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '12px',
              color: '#F5F3EE',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Grand Indonesia East Mall</span>
            <span style={{ color: '#D9BFA3' }}>B2 • C-14</span>
          </div>
        </div>

        {/* Spot Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              border: '1px solid #E2ECE9'
            }}
          >
            <div style={{ fontSize: '9px', color: '#789B9A', fontWeight: 700 }}>LANTAI</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#243B3D', marginTop: '2px' }}>
              {floor}
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              border: '1px solid #E2ECE9'
            }}
          >
            <div style={{ fontSize: '9px', color: '#789B9A', fontWeight: 700 }}>ZONA</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563EB', marginTop: '2px' }}>
              {zone}
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              border: '1px solid #E2ECE9'
            }}
          >
            <div style={{ fontSize: '9px', color: '#789B9A', fontWeight: 700 }}>SLOT</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#243B3D', marginTop: '2px' }}>
              {slot}
            </div>
          </div>
        </div>

        {/* Action Button: Cari Kendaraan */}
        <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
          <div
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              borderRadius: '18px',
              fontWeight: 800,
              fontSize: '13px',
              textAlign: 'center',
              boxShadow: locatePressed
                ? '0 2px 4px rgba(36, 59, 61, 0.4)'
                : '0 8px 24px rgba(36, 59, 61, 0.28)',
              transform: locatePressed ? 'scale(0.97)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: '16px' }}>🧭</span>
            <span>Cari Kendaraan Saya</span>
          </div>
        </div>
      </div>
    </div>
  )
}
