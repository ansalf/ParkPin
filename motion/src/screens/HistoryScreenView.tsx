import React from 'react'

export interface HistoryScreenViewProps {
  sessions?: Array<{
    date: string
    location: string
    slot: string
    duration: string
  }>
}

export const HistoryScreenView: React.FC<HistoryScreenViewProps> = ({
  sessions = [
    {
      date: 'Hari Ini, 14:10',
      location: 'Grand Indonesia East Mall',
      slot: 'B2 • Slot C-14',
      duration: '2j 15m'
    },
    {
      date: 'Kemarin, 19:30',
      location: 'Senayan City Mall',
      slot: 'P3 • Zona Hijau A-08',
      duration: '3j 40m'
    },
    {
      date: '10 Nov 2026',
      location: 'Pondok Indah Mall 2',
      slot: 'B1 • Tiang 18',
      duration: '1j 10m'
    }
  ]
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
        <span>18:15</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
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
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#243B3D' }}>
            Riwayat Parkir
          </h2>
          <p style={{ margin: 0, fontSize: '10px', color: '#789B9A', fontWeight: 600 }}>
            Tersimpan aman di perangkat
          </p>
        </div>
        <div
          style={{
            padding: '4px 10px',
            backgroundColor: '#E2ECE9',
            color: '#243B3D',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '12px'
          }}
        >
          {sessions.length} Sesi
        </div>
      </div>

      {/* List */}
      <div
        style={{
          flex: 1,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {sessions.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1px solid #E2ECE9',
              boxShadow: '0 2px 8px rgba(36, 59, 61, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#789B9A', fontWeight: 700 }}>
                {item.date}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: '#E2ECE9',
                  color: '#243B3D',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontWeight: 800
                }}
              >
                {item.duration}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#243B3D' }}>
              {item.location}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#2563EB',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>📍</span>
              <span>{item.slot}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
