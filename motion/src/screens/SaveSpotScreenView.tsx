import React from 'react'

export interface SaveSpotScreenViewProps {
  floor?: string
  zone?: string
  slot?: string
  notes?: string
  hasPhoto?: boolean
  submitPressed?: boolean
}

export const SaveSpotScreenView: React.FC<SaveSpotScreenViewProps> = ({
  floor = 'B2',
  zone = 'Blue',
  slot = 'C-14',
  notes = 'Dekat lift lobi utama, tiang P-42',
  hasPhoto = false,
  submitPressed = false
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
        <span>19:41</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>5G</span>
          <span>99%</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#E2ECE9',
              color: '#243B3D',
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
            <h2
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 800,
                color: '#243B3D'
              }}
            >
              Simpan Titik Parkir
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '10px',
                color: '#789B9A',
                fontWeight: 600
              }}
            >
              Grand Indonesia East Mall
            </p>
          </div>
        </div>
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: '#E2ECE9',
            color: '#243B3D',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '8px'
          }}
        >
          GPS Aktif
        </div>
      </div>

      {/* Form Content */}
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
        {/* Row 1: Floor & Zone */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1.5px solid #243B3D',
              boxShadow: '0 4px 12px rgba(36, 59, 61, 0.06)'
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: '#789B9A',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Lantai / Level
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#243B3D',
                marginTop: '4px'
              }}
            >
              {floor}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1px solid #E2ECE9',
              boxShadow: '0 2px 8px rgba(36, 59, 61, 0.04)'
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: '#789B9A',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Zona Warna
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#2563EB',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB'
                }}
              />
              {zone}
            </div>
          </div>
        </div>

        {/* Row 2: Slot / Nomor Tiang */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 14px',
            border: '1px solid #E2ECE9',
            boxShadow: '0 2px 8px rgba(36, 59, 61, 0.04)'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#789B9A',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Nomor Tiang / Slot Parkir
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#243B3D',
              marginTop: '4px',
              letterSpacing: '0.02em'
            }}
          >
            {slot}
          </div>
        </div>

        {/* Row 3: Photo Capture / Landmark Preview */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 14px',
            border: hasPhoto ? '2px solid #789B9A' : '1.5px dashed #D9BFA3',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: hasPhoto ? '#243B3D' : '#F5F3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: hasPhoto ? '#F5F3EE' : '#789B9A'
            }}
          >
            📷
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#243B3D'
              }}
            >
              {hasPhoto ? 'Foto Landmark Terpasang' : 'Ambil Foto Patokan'}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: '#789B9A',
                marginTop: '2px'
              }}
            >
              {hasPhoto ? 'Pilar P-42 & Sign Lift Utama' : 'Tiang terdekat atau pintu masuk mall'}
            </div>
          </div>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '10px',
              backgroundColor: hasPhoto ? '#E2ECE9' : '#243B3D',
              color: hasPhoto ? '#243B3D' : '#F5F3EE',
              fontSize: '10px',
              fontWeight: 800
            }}
          >
            {hasPhoto ? 'Ubah' : 'Foto'}
          </div>
        </div>

        {/* Row 4: Catatan / Landmark text */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 14px',
            border: '1px solid #E2ECE9'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#789B9A',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Catatan Landmark
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#243B3D',
              marginTop: '4px'
            }}
          >
            {notes}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
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
              boxShadow: submitPressed
                ? '0 2px 4px rgba(36, 59, 61, 0.4)'
                : '0 8px 24px rgba(36, 59, 61, 0.28)',
              transform: submitPressed ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            <span>📍</span>
            <span>Simpan Titik Parkir</span>
          </div>
        </div>
      </div>
    </div>
  )
}
