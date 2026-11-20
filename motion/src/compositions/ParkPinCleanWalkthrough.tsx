import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing
} from 'remotion'
import { PhoneMockup } from '../components/PhoneMockup'
import { HomeScreenEmpty } from '../screens/HomeScreenEmpty'
import { SaveSpotScreenView } from '../screens/SaveSpotScreenView'
import { LandmarkDetailScreenView } from '../screens/LandmarkDetailScreenView'
import { FindVehicleScreenView } from '../screens/FindVehicleScreenView'
import { HistoryScreenView } from '../screens/HistoryScreenView'
import { TapIndicator } from '../components/TapIndicator'

export const ParkPinCleanWalkthrough: React.FC = () => {
  const frame = useCurrentFrame()

  // Timeline (Total: 900 frames @ 30 FPS = 30.0 seconds)
  // Phase 1: 0 - 150 (0s - 5s)   -> Home Screen & Tap "+ Simpan Titik Parkir Baru"
  // Phase 2: 150 - 330 (5s - 11s) -> Form Save Spot & Tap "Simpan Titik Parkir"
  // Phase 3: 330 - 510 (11s - 17s)-> Active Parking / Landmark Detail & Tap "Temukan Kendaraan"
  // Phase 4: 510 - 690 (17s - 23s)-> Radar Navigation & Tap "Sudah Menemukan Kendaraan"
  // Phase 5: 690 - 810 (23s - 27s)-> Parking History List
  // Phase 6: 810 - 900 (27s - 30s)-> Brand Outro

  // Determine active step index (0 to 5)
  let activeStep = 0
  if (frame >= 810) activeStep = 5
  else if (frame >= 690) activeStep = 4
  else if (frame >= 510) activeStep = 3
  else if (frame >= 330) activeStep = 2
  else if (frame >= 150) activeStep = 1

  const steps = [
    {
      num: '01',
      tag: 'BERANDA',
      title: 'Buka Aplikasi ParkPin',
      desc: 'Tampilan bersih dan minimalis. Siap mencatat lokasi parkir dengan satu ketukan instan.'
    },
    {
      num: '02',
      tag: 'SIMPAN LOKASI',
      title: 'Catat Lantai & Landmark',
      desc: 'Masukkan nomor lantai (B2), area tiang, atau patokan terdekat agar kendaraan tidak hilang.'
    },
    {
      num: '03',
      tag: 'STATUS AKTIF',
      title: 'Informasi Parkir Tersimpan',
      desc: 'Durasi parkir tercatat rapi secara real-time bersama lokasi lantai dan detail slot kendaraan.'
    },
    {
      num: '04',
      tag: 'NAVIGASI KEMBALI',
      title: 'Temukan Posisi Kendaraan',
      desc: 'Panduan radar dan jarak langsung memandu langkah Anda kembali ke tempat kendaraan diparkir.'
    },
    {
      num: '05',
      tag: 'RIWAYAT OFFLINE',
      title: 'Riwayat Tersimpan Privat',
      desc: 'Seluruh riwayat parkir tersimpan aman di perangkat tanpa memerlukan koneksi internet.'
    },
    {
      num: '06',
      tag: 'PARKPIN',
      title: 'Never Lose Your Spot Again',
      desc: 'Aplikasi memori parkir modern, cepat, dan sepenuhnya berjalan privat di ponsel Anda.'
    }
  ]

  const currentStep = steps[activeStep]

  // Subtle content crossfade when step changes
  const stepFade = interpolate(
    frame % 180, // or approximate
    [0, 15],
    [0.7, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Distance decreasing during radar phase (frames 510 to 690)
  const radarDistance = Math.round(
    interpolate(frame, [530, 640], [35, 3], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    })
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5F3EE',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 120px',
        fontFamily: 'Inter, -apple-system, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* LEFT COLUMN: Clean Branding & Context Steps (Static, Steady) */}
      <div
        style={{
          width: '580px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '32px'
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#243B3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(36, 59, 61, 0.2)'
            }}
          >
            {/* Pin Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="#F5F3EE"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#243B3D',
                letterSpacing: '-0.5px'
              }}
            >
              ParkPin
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#789B9A',
                letterSpacing: '0.5px'
              }}
            >
              PERSONAL PARKING MEMORY
            </div>
          </div>
        </div>

        {/* Current Step Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 12px 35px -8px rgba(36, 59, 61, 0.08)',
            border: '1px solid rgba(120, 155, 154, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            opacity: stepFade
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                backgroundColor: '#E2ECE9',
                color: '#243B3D',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px'
              }}
            >
              LANGKAH {currentStep.num}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#789B9A',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {currentStep.tag}
            </span>
          </div>

          <div
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#243B3D',
              lineHeight: 1.25,
              letterSpacing: '-0.5px'
            }}
          >
            {currentStep.title}
          </div>

          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#55696B',
              lineHeight: 1.6
            }}
          >
            {currentStep.desc}
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                height: '6px',
                width: idx === activeStep ? '36px' : '12px',
                borderRadius: '3px',
                backgroundColor: idx === activeStep ? '#243B3D' : 'rgba(120, 155, 154, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Static Phone Mockup (STRICTLY NO ZOOM IN, NO ZOOM OUT) */}
      <div
        style={{
          width: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Soft Ambient Shadow under Phone */}
        <div
          style={{
            position: 'absolute',
            width: '380px',
            height: '40px',
            bottom: '-20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(26, 44, 46, 0.12)',
            filter: 'blur(20px)'
          }}
        />

        {/* PhoneMockup at STRICT CONSTANT SCALE = 1.0 (NO ZOOM) */}
        <div style={{ transform: 'none', position: 'relative' }}>
          <PhoneMockup width={390} height={810}>
            {/* SCREEN 1: Home Screen (frames 0 - 150) */}
            {frame < 150 && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <HomeScreenEmpty buttonPressed={frame >= 70 && frame <= 95} />
                {/* Tap on "+ Simpan Titik Parkir Baru" button */}
                <TapIndicator
                  delayFrame={65}
                  durationFrames={30}
                  x={195}
                  y={660}
                  size={52}
                />
              </div>
            )}

            {/* SCREEN 2: Save Spot Form (frames 150 - 330) */}
            {frame >= 150 && frame < 330 && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <SaveSpotScreenView
                  floor="B2"
                  zone="Zona Biru"
                  slot="Tiang P-14"
                  notes="Dekat lift lobi utama"
                  hasPhoto={frame >= 200}
                  submitPressed={frame >= 250 && frame <= 280}
                />
                {/* Tap on "Simpan Titik Parkir" CTA at bottom */}
                <TapIndicator
                  delayFrame={245}
                  durationFrames={30}
                  x={195}
                  y={710}
                  size={52}
                />
              </div>
            )}

            {/* SCREEN 3: Landmark Details & Active Status (frames 330 - 510) */}
            {frame >= 330 && frame < 510 && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <LandmarkDetailScreenView
                  floor="B2"
                  zone="Zona Biru"
                  slot="Tiang P-14"
                  elapsedTime="38m"
                  locatePressed={frame >= 430 && frame <= 460}
                />
                {/* Tap on "Temukan Kendaraan Saya" button */}
                <TapIndicator
                  delayFrame={425}
                  durationFrames={30}
                  x={195}
                  y={630}
                  size={52}
                />
              </div>
            )}

            {/* SCREEN 4: Find Vehicle Radar (frames 510 - 690) */}
            {frame >= 510 && frame < 690 && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <FindVehicleScreenView
                  heading={240}
                  distanceMeters={radarDistance}
                  floor="B2"
                  slot="Tiang P-14"
                  arrived={radarDistance <= 5}
                />
                {/* Tap on "Sudah Menemukan Kendaraan" button */}
                <TapIndicator
                  delayFrame={615}
                  durationFrames={30}
                  x={195}
                  y={760}
                  size={52}
                />
              </div>
            )}

            {/* SCREEN 5: Parking History (frames 690 - 810) */}
            {frame >= 690 && frame < 810 && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <HistoryScreenView />
              </div>
            )}

            {/* SCREEN 6: Brand Outro (frames 810 - 900) */}
            {frame >= 810 && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#243B3D',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  boxSizing: 'border-box',
                  gap: '20px'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#F5F3EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                      fill="#243B3D"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#F5F3EE',
                    letterSpacing: '-0.5px'
                  }}
                >
                  ParkPin
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#D9BFA3',
                    textAlign: 'center'
                  }}
                >
                  Never Lose Your Spot Again.
                </div>
              </div>
            )}
          </PhoneMockup>
        </div>
      </div>
    </AbsoluteFill>
  )
}
