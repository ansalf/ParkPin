import React from 'react'
import { demoActiveRecord } from '../data/demoData'

interface ParkPinHomeScreenViewProps {
  vehicleType?: 'mobil' | 'motor'
}

export const ParkPinHomeScreenView: React.FC<ParkPinHomeScreenViewProps> = ({
  vehicleType = 'mobil'
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F3EE',
        color: '#1A2C2E',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Status & Safe Area Bar */}
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
        <span>19:42</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Bar */}
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
              fontSize: '13px',
              boxShadow: '0 2px 4px rgba(36, 59, 61, 0.2)'
            }}
          >
            P
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '17px',
              color: '#243B3D',
              letterSpacing: '-0.3px'
            }}
          >
            ParkPin
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <div
            style={{
              padding: '4px 10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E1D8',
              color: '#243B3D',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '10px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            v1.0.0
          </div>
          <div
            style={{
              padding: '4px 10px',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '10px'
            }}
          >
            Offline
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'hidden'
        }}
      >
        {/* Quick Vehicle Switcher */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '4px',
            display: 'flex',
            border: '1px solid #E5E1D8',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '7px 0',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 800,
              borderRadius: '12px',
              backgroundColor: vehicleType === 'mobil' ? '#243B3D' : 'transparent',
              color: vehicleType === 'mobil' ? '#F5F3EE' : '#64748B',
              boxShadow: vehicleType === 'mobil' ? '0 2px 4px rgba(36, 59, 61, 0.2)' : 'none'
            }}
          >
            🚗 Mobil
          </div>
          <div
            style={{
              flex: 1,
              padding: '7px 0',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '12px',
              backgroundColor: vehicleType === 'motor' ? '#243B3D' : 'transparent',
              color: vehicleType === 'motor' ? '#F5F3EE' : '#64748B'
            }}
          >
            🛵 Motor
          </div>
        </div>

        {/* Active Parking Session Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '16px',
            border: '1px solid #E5E1D8',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#64748B'
                }}
              >
                Parkir Aktif
              </span>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#1A2C2E',
                  marginTop: '1px'
                }}
              >
                {demoActiveRecord.garage_name}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 9px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#065F46'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981'
                }}
              />
              <span>{demoActiveRecord.duration_text}</span>
            </div>
          </div>

          {/* Floor & Pillar highlight box */}
          <div
            style={{
              backgroundColor: '#F5F3EE',
              borderRadius: '18px',
              padding: '14px',
              border: '1px solid #E5E1D8',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Lantai
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#243B3D', letterSpacing: '-0.5px' }}>
                {demoActiveRecord.floor_level}
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', backgroundColor: '#E5E1D8' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Kode Pilar
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#243B3D', letterSpacing: '-0.5px' }}>
                {demoActiveRecord.slot_bay}
              </div>
            </div>
          </div>

          {/* Location note */}
          <div
            style={{
              fontSize: '11px',
              color: '#475569',
              lineHeight: '1.4',
              backgroundColor: 'rgba(245, 243, 238, 0.4)',
              padding: '8px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(229, 225, 216, 0.6)'
            }}
          >
            📍 <strong>Patokan:</strong> {demoActiveRecord.zone_section}
          </div>

          {/* Primary Action Button (52px height) */}
          <div
            style={{
              height: '46px',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '13px',
              boxShadow: '0 4px 10px rgba(36, 59, 61, 0.25)',
              gap: '6px'
            }}
          >
            <span>🧭</span>
            <span>Cari Kendaraan Saya</span>
          </div>
        </div>

        {/* Feature Pill (Offline Memory Guarantee) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '12px 14px',
            border: '1px solid #E5E1D8',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: 'rgba(216, 226, 220, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#1A2C2E' }}>
              100% Berjalan di Basement
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              Data tersimpan langsung di HP tanpa kuota
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Navigation Bar */}
      <div
        style={{
          height: '62px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E1D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '8px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: '#243B3D'
          }}
        >
          <div style={{ fontSize: '14px' }}>📍</div>
          <span style={{ fontSize: '9px', fontWeight: 800 }}>Beranda</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: '#94A3B8'
          }}
        >
          <div style={{ fontSize: '14px' }}>🕒</div>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>Riwayat</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: '#94A3B8'
          }}
        >
          <div style={{ fontSize: '14px' }}>⚙️</div>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>Pengaturan</span>
        </div>
      </div>
    </div>
  )
}
