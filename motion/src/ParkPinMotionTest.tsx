import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing
} from 'remotion'
import { PhoneMockup } from './components/PhoneMockup'
import { ParkPinHomeScreenView } from './components/ParkPinHomeScreenView'
import { TapIndicator } from './components/TapIndicator'

export const ParkPinMotionTest: React.FC = () => {
  const frame = useCurrentFrame()

  // 1. Background subtle ambient glow pulse
  const glowScale = interpolate(frame, [0, 75, 150], [1, 1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // 2. Logo entrance animation (frames 0 - 30)
  const logoScale = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // 3. Title & Tagline entrance (frames 10 - 40)
  const titleY = interpolate(frame, [10, 35], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })
  const titleOpacity = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // 4. Feature list entrance (frames 25 - 55)
  const featuresOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const featuresX = interpolate(frame, [25, 50], [-25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })

  // 5. Phone Mockup entrance animation (frames 15 - 50)
  const phoneY = interpolate(frame, [15, 50], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })
  const phoneScale = interpolate(frame, [15, 50], [0.88, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  })
  const phoneOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // 6. Subtle phone floating oscillation after frame 50
  const phoneFloat =
    frame > 50
      ? Math.sin(((frame - 50) / 100) * Math.PI * 2) * 6
      : 0

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5F3EE',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 120px',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Radial Backdrop Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '15%',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(36, 59, 61, 0.08) 0%, rgba(245, 243, 238, 0) 70%)',
          transform: `scale(${glowScale})`,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(245, 243, 238, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* LEFT COLUMN: Brand Hero & Value Proposition */}
      <div
        style={{
          flex: 1.1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '28px',
          paddingRight: '60px',
          zIndex: 10
        }}
      >
        {/* Animated Brand Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            padding: '8px 18px 8px 10px',
            borderRadius: '999px',
            border: '1px solid #E5E1D8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            width: 'fit-content',
            opacity: logoOpacity,
            transform: `scale(${logoScale})`
          }}
        >
          {/* Circular P Logo */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#243B3D',
              color: '#F5F3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              boxShadow: '0 3px 6px rgba(36, 59, 61, 0.25)'
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: '20px',
                color: '#243B3D',
                letterSpacing: '-0.4px'
              }}
            >
              ParkPin
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#065F46',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '2px 8px',
                borderRadius: '8px'
              }}
            >
              v1.0.0
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#1A2C2E',
              lineHeight: 1.12,
              letterSpacing: '-1.5px',
              margin: 0
            }}
          >
            Ingat Titik Parkir <br />
            <span style={{ color: '#243B3D' }}>Tanpa Kuota & Panik.</span>
          </h1>

          <p
            style={{
              fontSize: '20px',
              color: '#475569',
              lineHeight: 1.5,
              maxWidth: '540px',
              margin: 0
            }}
          >
            Solusi pintar pencatat lantai, kode pilar, patokan lobi, dan karcis
            kendaraan di mall & gedung. 100% berfungsi offline di basement bawah
            tanah.
          </p>
        </div>

        {/* Key Features Badges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            opacity: featuresOpacity,
            transform: `translateX(${featuresX}px)`
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '17px',
              fontWeight: 700,
              color: '#1A2C2E'
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                border: '1px solid #A7F3D0'
              }}
            >
              ✓
            </span>
            <span>100% Berfungsi di Basement Tanpa Internet</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '17px',
              fontWeight: 700,
              color: '#1A2C2E'
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                border: '1px solid #A7F3D0'
              }}
            >
              ✓
            </span>
            <span>Dukungan Mobil 🚗 & Motor 🛵 Sekali Tap</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '17px',
              fontWeight: 700,
              color: '#1A2C2E'
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                border: '1px solid #A7F3D0'
              }}
            >
              ✓
            </span>
            <span>Instalasi Instan PWA &lt; 1 MB Bebas Iklan</span>
          </div>
        </div>

        {/* Footer Credit */}
        <div
          style={{
            fontSize: '13px',
            color: '#64748B',
            fontWeight: 600,
            paddingTop: '6px'
          }}
        >
          Developed by <strong>saaproject</strong> · Progressive Web App (PWA)
        </div>
      </div>

      {/* RIGHT COLUMN: Realistic Phone Mockup with Actual ParkPin UI */}
      <div
        style={{
          flex: 0.9,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          opacity: phoneOpacity,
          transform: `translateY(${phoneY + phoneFloat}px) scale(${phoneScale})`
        }}
      >
        <PhoneMockup width={390} height={780}>
          <ParkPinHomeScreenView vehicleType="mobil" />
        </PhoneMockup>

        {/* Interactive Tap Indicator highlighting the Compass button around frame 65 */}
        <TapIndicator delayFrame={65} durationFrames={30} x={0} y={150} />
      </div>
    </AbsoluteFill>
  )
}
