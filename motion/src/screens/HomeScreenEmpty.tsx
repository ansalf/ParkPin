import React from 'react'

export interface HomeScreenEmptyProps {
  buttonPressed?: boolean
}

export const HomeScreenEmpty: React.FC<HomeScreenEmptyProps> = ({
  buttonPressed = false
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
        <span>19:40</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* TopBar */}
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
            padding: '5px 12px',
            backgroundColor: '#243B3D',
            color: '#F5F3EE',
            fontSize: '11px',
            fontWeight: 800,
            borderRadius: '12px'
          }}
        >
          Install
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          justifyContent: 'center'
        }}
      >
        {/* Beacon Empty Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '24px 20px',
            border: '1px solid #E5E1D8',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          {/* Animated Circle Beacon */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: 'rgba(216, 226, 220, 0.5)'
              }}
            />
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '28px',
                boxShadow: '0 4px 12px rgba(36, 59, 61, 0.3)'
              }}
            >
              P
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#1A2C2E',
                margin: 0
              }}
            >
              Belum Ada Parkir Aktif
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: '#64748B',
                marginTop: '6px',
                lineHeight: 1.45
              }}
            >
              ParkPin siap mengingat lokasi parkir Anda. Simpan lantai, kode
              pilar, atau patokan saat memarkir kendaraan.
            </p>
          </div>

          {/* Primary Action Button */}
          <div
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(36, 59, 61, 0.25)',
              transform: buttonPressed ? 'scale(0.96)' : 'scale(1)',
              transition: 'transform 0.1s ease',
              gap: '8px'
            }}
          >
            <span>📍</span>
            <span>Simpan Titik Parkir Baru</span>
          </div>
        </div>

        {/* Tip Card */}
        <div
          style={{
            backgroundColor: 'rgba(226, 236, 233, 0.45)',
            border: '1px solid rgba(120, 155, 154, 0.3)',
            borderRadius: '20px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            📸
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#1A2C2E' }}>
              Tips Cepat Parkir
            </div>
            <div style={{ fontSize: '10px', color: '#475569' }}>
              Foto nomor tiang / patokan lobi agar tidak tersesat
            </div>
          </div>
        </div>
      </div>

      {/* BottomNav */}
      <div
        style={{
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E1D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '8px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#243B3D' }}>
          <div style={{ fontSize: '15px' }}>📍</div>
          <span style={{ fontSize: '10px', fontWeight: 800 }}>Beranda</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#94A3B8' }}>
          <div style={{ fontSize: '15px' }}>🕒</div>
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Riwayat</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#94A3B8' }}>
          <div style={{ fontSize: '15px' }}>⚙️</div>
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Pengaturan</span>
        </div>
      </div>
    </div>
  )
}
