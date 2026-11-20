import React from 'react'

export interface FindVehicleScreenViewProps {
  heading?: number
  distanceMeters?: number
  floor?: string
  slot?: string
  arrived?: boolean
}

export const FindVehicleScreenView: React.FC<FindVehicleScreenViewProps> = ({
  heading = 240,
  distanceMeters = 35,
  floor = 'B2',
  slot = 'C-14',
  arrived = false
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#243B3D',
        color: '#F5F3EE',
        fontFamily: 'Inter, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Status Bar Dark */}
      <div
        style={{
          height: '44px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 24px 6px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#E2ECE9'
        }}
      >
        <span>20:25</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
          <span>95%</span>
        </div>
      </div>

      {/* Top Header */}
      <div
        style={{
          padding: '10px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(226, 236, 233, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 243, 238, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 800
            }}
          >
            ←
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#F5F3EE' }}>
              Panduan Menuju Mobil
            </h2>
            <p style={{ margin: 0, fontSize: '10px', color: '#789B9A' }}>
              Mode Navigasi Basement
            </p>
          </div>
        </div>
        <div
          style={{
            padding: '4px 10px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '12px'
          }}
        >
          {arrived ? 'Tiba di Spot' : 'Kompas Aktif'}
        </div>
      </div>

      {/* Main Compass HUD Body */}
      <div
        style={{
          flex: 1,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Step instruction banner */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#D9BFA3',
              color: '#243B3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px'
            }}
          >
            ↓
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#F5F3EE' }}>
              Turun ke Lantai {floor}
            </div>
            <div style={{ fontSize: '11px', color: '#D9BFA3', marginTop: '2px' }}>
              Gunakan Lift Lobi Utama dekat pilar P-42
            </div>
          </div>
        </div>

        {/* Circular Compass Dial */}
        <div
          style={{
            position: 'relative',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            border: '2px dashed rgba(217, 191, 163, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0'
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              position: 'absolute',
              width: '170px',
              height: '170px',
              borderRadius: '50%',
              backgroundColor: 'rgba(26, 44, 46, 0.6)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
              border: '1px solid rgba(245, 243, 238, 0.1)'
            }}
          />

          {/* Compass Needle Rotating */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${heading}deg)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Arrow North / Target */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '45px solid #10B981',
                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))'
              }}
            />
            {/* Needle South */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '35px solid rgba(245, 243, 238, 0.3)'
              }}
            />
          </div>

          {/* Center Distance Hub */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              backgroundColor: '#F5F3EE',
              color: '#243B3D',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: '3px solid #243B3D'
            }}
          >
            <div
              style={{
                fontSize: '22px',
                fontWeight: 900,
                lineHeight: 1
              }}
            >
              {arrived ? '0' : distanceMeters}
              <span style={{ fontSize: '11px', fontWeight: 700 }}>m</span>
            </div>
            <div
              style={{
                fontSize: '8px',
                color: '#789B9A',
                fontWeight: 800,
                marginTop: '3px',
                letterSpacing: '0.05em'
              }}
            >
              {arrived ? 'ARRIVED' : 'JARAK ESTIMASI'}
            </div>
          </div>
        </div>

        {/* Direction details & target card */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#F5F3EE',
            borderRadius: '18px',
            padding: '12px 16px',
            color: '#243B3D',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #E2ECE9',
              paddingBottom: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 700 }}>
                ARAH KOMPAS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#243B3D' }}>
                {heading}° Barat Daya
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 700 }}>
                TARGET PARKIR
              </div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#2563EB' }}>
                {floor} • {slot}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontWeight: 700,
              color: '#789B9A'
            }}
          >
            <span>🧭 Buka Google Maps</span>
            <span style={{ color: '#243B3D', fontWeight: 800 }}>Selesai Parkir →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
