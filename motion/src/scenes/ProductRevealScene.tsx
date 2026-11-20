import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { HomeScreenEmpty } from '../screens/HomeScreenEmpty'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const ProductRevealScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Background color interpolation from dark teal to warm ivory
  const bgProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })

  // Camera subtle pull-out
  const dolly = interpolate(frame, [0, 240], [50, 0], {
    easing: MotionCurves.gentle
  })
  const panX = interpolate(frame, [0, 240], [40, 0], {
    easing: MotionCurves.gentle
  })

  // 3D Phone Entrance Spring
  const phoneEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1.1 }
  })

  const phoneY = interpolate(phoneEntrance, [0, 1], [400, 0])
  const phoneRotY = interpolate(phoneEntrance, [0, 1], [25, 0])
  const phoneRotX = interpolate(phoneEntrance, [0, 1], [15, 0])
  const phoneScale = interpolate(phoneEntrance, [0, 1], [1.25, 0.88])

  // Logo Badge Intro at start of scene (frames 0 - 60)
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 }
  })
  const logoOpacity = interpolate(frame, [0, 20, 65, 85], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // Typography Entrance
  const textOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgProgress > 0.5 ? '#F5F3EE' : '#0F1819',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background Gradient Transition Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, #FAF8F5 0%, #E2ECE9 100%)',
          opacity: bgProgress,
          transition: 'opacity 0.2s ease'
        }}
      />

      <CameraRig panX={panX} dollyZ={dolly}>
        {/* Intro Logo Transition (frames 0 to 75) */}
        {frame < 80 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${logoScale})`,
              opacity: logoOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 30
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 900,
                boxShadow: '0 16px 40px rgba(36, 59, 61, 0.35)',
                border: '4px solid #D9BFA3'
              }}
            >
              P
            </div>
            <div
              style={{
                marginTop: '16px',
                fontSize: '32px',
                fontWeight: 900,
                color: '#243B3D',
                letterSpacing: '-0.02em'
              }}
            >
              ParkPin
            </div>
          </div>
        )}

        {/* Hero Split Layout: Typography on Left, 3D Phone on Right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 120px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left: Kinetic Typography */}
          <div
            style={{
              flex: 1,
              maxWidth: '680px',
              opacity: textOpacity,
              zIndex: 10
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#789B9A',
                marginBottom: '16px'
              }}
            >
              THE MODERN PARKING COMPANION
            </div>

            <MaskedHeading
              text="Meet ParkPin."
              startFrame={65}
              fontSize="76px"
              color="#243B3D"
            />

            <h2
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: '#2563EB',
                marginTop: '16px',
                letterSpacing: '-0.02em',
                opacity: interpolate(frame, [90, 115], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                })
              }}
            >
              Never Lose Your Spot Again.
            </h2>

            <p
              style={{
                fontSize: '20px',
                color: '#789B9A',
                lineHeight: 1.5,
                marginTop: '16px',
                fontWeight: 500,
                opacity: interpolate(frame, [115, 140], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                })
              }}
            >
              One-tap offline vehicle location tracking with floor levels, visual landmarks,
              and directional compass guidance.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
                opacity: interpolate(frame, [140, 165], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                })
              }}
            >
              <div
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#243B3D',
                  color: '#F5F3EE',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚡</span>
                <span>100% Offline Ready</span>
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#E2ECE9',
                  color: '#243B3D',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📍</span>
                <span>Zero Frustration</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Phone Mockup */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate3d(0, ${phoneY}px, 0)`,
              zIndex: 20
            }}
          >
            <PhoneMockup3D
              rotateX={phoneRotX}
              rotateY={phoneRotY}
              scale={phoneScale}
              elevation={45}
            >
              <HomeScreenEmpty />
            </PhoneMockup3D>
          </div>
        </div>
      </CameraRig>
    </div>
  )
}
