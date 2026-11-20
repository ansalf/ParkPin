import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { LandmarkDetailScreenView } from '../screens/LandmarkDetailScreenView'
import { MotionCurves } from '../animations/easing'

export const BrandFinaleScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera slow pull-out
  const cameraZ = interpolate(frame, [0, 420], [30, 0], {
    easing: MotionCurves.gentle
  })

  // Hero Phone position (starts centered and slides slightly left as CTA appears)
  const phoneX = interpolate(frame, [120, 180], [0, -320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeInOutCubic
  })

  // Kinetic Words Entrance: "Park.", "Pin.", "Find."
  const word1Spring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 140 }
  })
  const word2Spring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 140 }
  })
  const word3Spring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 14, stiffness: 140 }
  })

  // Logo & CTA entrance
  const ctaSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 15, stiffness: 100 }
  })
  const ctaOpacity = interpolate(frame, [145, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#243B3D',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          height: '700px',
          background: 'radial-gradient(ellipse, rgba(217, 191, 163, 0.22) 0%, rgba(36, 59, 61, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <CameraRig dollyZ={cameraZ}>
        {/* Rhythmic Kinetic Intro Words (frames 0 to 140, centered) */}
        {frame < 155 && (
          <div
            style={{
              position: 'absolute',
              top: '16%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              width: '100%'
            }}
          >
            <span
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#F5F3EE',
                transform: `scale(${Math.max(0, word1Spring)})`,
                display: 'inline-block'
              }}
            >
              Park.
            </span>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#D9BFA3',
                transform: `scale(${Math.max(0, word2Spring)})`,
                display: 'inline-block'
              }}
            >
              Pin.
            </span>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#789B9A',
                transform: `scale(${Math.max(0, word3Spring)})`,
                display: 'inline-block'
              }}
            >
              Find.
            </span>
          </div>
        )}

        {/* Center Hero Phone */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            transform: `translate(-50%, -50%) translateX(${phoneX}px)`,
            zIndex: 20
          }}
        >
          <PhoneMockup3D
            scale={0.88}
            rotateY={interpolate(frame, [0, 420], [0, 4])}
            rotateX={2}
            elevation={55}
          >
            <LandmarkDetailScreenView
              floor="B2"
              zone="Blue"
              slot="C-14"
              elapsedTime="1j 45m"
            />
          </PhoneMockup3D>
        </div>

        {/* Brand Finale Lockup & CTA (Right side, enters after frame 140) */}
        {frame >= 140 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '120px',
              transform: `translateY(-50%) scale(${ctaSpring})`,
              opacity: ctaOpacity,
              maxWidth: '560px',
              zIndex: 30
            }}
          >
            {/* Logo Lockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#F5F3EE',
                  color: '#243B3D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  fontWeight: 900,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  border: '3px solid #D9BFA3'
                }}
              >
                P
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#F5F3EE',
                    letterSpacing: '-0.02em'
                  }}
                >
                  ParkPin
                </h1>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '14px',
                    color: '#D9BFA3',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}
                >
                  Never Lose Your Spot Again
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: '18px',
                color: '#E2ECE9',
                lineHeight: 1.5,
                marginTop: '24px',
                fontWeight: 500
              }}
            >
              The fast, privacy-friendly PWA that remembers where you parked — even deep underground
              without internet connection.
            </p>

            {/* Install CTA Button */}
            <div
              style={{
                marginTop: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                backgroundColor: '#F5F3EE',
                color: '#243B3D',
                padding: '16px 36px',
                borderRadius: '24px',
                fontWeight: 900,
                fontSize: '18px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '22px' }}>📲</span>
              <span>Install ParkPin</span>
            </div>

            {/* Badges */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '22px',
                fontSize: '12px',
                color: '#789B9A',
                fontWeight: 700
              }}
            >
              <span>✓ Progressive Web App</span>
              <span>✓ iOS & Android</span>
              <span>✓ 100% Offline Ready</span>
            </div>
          </div>
        )}
      </CameraRig>
    </div>
  )
}
