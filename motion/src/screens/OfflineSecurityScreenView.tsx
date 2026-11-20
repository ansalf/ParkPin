import React from 'react'

export interface OfflineSecurityScreenViewProps {
  mode?: 'offline' | 'cloud'
}

export const OfflineSecurityScreenView: React.FC<OfflineSecurityScreenViewProps> = ({
  mode = 'offline'
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
        <span>20:30</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ color: '#EF4444', fontWeight: 800 }}>No Signal</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          padding: '10px 18px 12px',
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
            {mode === 'offline' ? 'Offline First' : 'Cloud Sync'}
          </span>
        </div>
        <div
          style={{
            padding: '4px 10px',
            backgroundColor: mode === 'offline' ? '#FEF3C7' : '#D1FAE5',
            color: mode === 'offline' ? '#92400E' : '#065F46',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '12px'
          }}
        >
          {mode === 'offline' ? '⚡ 100% Offline' : '☁️ Auto Sync'}
        </div>
      </div>

      {/* Body Feature Cards */}
      <div
        style={{
          flex: 1,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px'
        }}
      >
        {mode === 'offline' ? (
          <>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px 18px',
                border: '1.5px solid #243B3D',
                boxShadow: '0 8px 24px rgba(36, 59, 61, 0.08)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#E2ECE9',
                  color: '#243B3D',
                  fontSize: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                📡
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#243B3D' }}>
                Bekerja Tanpa Sinyal
              </h3>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '12px',
                  color: '#789B9A',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}
              >
                Parkir di basement terdalam B3-B5 tanpa sinyal internet? ParkPin tetap menyimpan
                foto dan kompas secara lokal instan.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#243B3D',
                borderRadius: '16px',
                padding: '14px 16px',
                color: '#F5F3EE',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '20px' }}>🔒</span>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>
                Data tersimpan di storage lokal HP dengan enkripsi aman.
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px 18px',
                border: '1.5px solid #243B3D',
                boxShadow: '0 8px 24px rgba(36, 59, 61, 0.08)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#E2ECE9',
                  color: '#243B3D',
                  fontSize: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                ☁️
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#243B3D' }}>
                Sinkronisasi Otomatis
              </h3>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '12px',
                  color: '#789B9A',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}
              >
                Begitu HP Anda kembali mendapatkan sinyal 4G/5G atau WiFi, riwayat parkir Anda
                otomatis tercadangkan ke cloud akun Anda.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#E2ECE9',
                borderRadius: '16px',
                padding: '14px 16px',
                color: '#243B3D',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '20px' }}>✨</span>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>
                Akses dari perangkat lain cukup login dengan email Anda.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
