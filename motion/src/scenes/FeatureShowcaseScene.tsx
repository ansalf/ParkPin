import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { LandmarkDetailScreenView } from '../screens/LandmarkDetailScreenView'
import { HistoryScreenView } from '../screens/HistoryScreenView'
import { OfflineSecurityScreenView } from '../screens/OfflineSecurityScreenView'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const FeatureShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera slow dolly
  const cameraZ = interpolate(frame, [0, 420], [0, 40], {
    easing: MotionCurves.gentle
  })

  // Left Phone Entrance
  const leftSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 90 }
  })
  const leftX = interpolate(leftSpring, [0, 1], [-600, -360])
  const leftRotY = interpolate(leftSpring, [0, 1], [40, 22])

  // Right Phone Entrance
  const rightSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15, stiffness: 90 }
  })
  const rightX = interpolate(rightSpring, [0, 1], [600, 360])
  const rightRotY = interpolate(rightSpring, [0, 1], [-40, -22])

  // Center Phone Entrance
  const centerSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 100 }
  })
  const centerY = interpolate(centerSpring, [0, 1], [200, 40])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F3EE',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '700px',
          background: 'radial-gradient(ellipse, #E2ECE9 0%, #F5F3EE 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <CameraRig dollyZ={cameraZ}>
        {/* Top Centered Header */}
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
            width: '100%'
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#789B9A',
              marginBottom: '10px'
            }}
          >
            COMPLETE RELIABILITY
          </div>

          <MaskedHeading
            text="Engineered for every garage."
            startFrame={15}
            fontSize="54px"
            color="#243B3D"
          />

          <p
            style={{
              fontSize: '18px',
              color: '#789B9A',
              maxWidth: '720px',
              margin: '12px auto 0',
              fontWeight: 500,
              opacity: interpolate(frame, [40, 65], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }}
          >
            Works seamlessly without internet in deep basements, saves historical sessions,
            and secures your identity.
          </p>
        </div>

        {/* 3-Phone Perspective Showcase */}
        <div
          style={{
            position: 'absolute',
            top: '56%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
        >
          {/* Left Phone: History */}
          <div
            style={{
              position: 'absolute',
              transform: `translateX(${leftX}px) translateY(80px)`,
              zIndex: 15
            }}
          >
            <PhoneMockup3D
              scale={0.78}
              rotateY={leftRotY}
              rotateX={4}
              elevation={35}
            >
              <HistoryScreenView />
            </PhoneMockup3D>
            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(36, 59, 61, 0.2)'
              }}
            >
              📜 Riwayat Parkir
            </div>
          </div>

          {/* Center Phone: Active Landmark */}
          <div
            style={{
              position: 'absolute',
              transform: `translateY(${centerY}px)`,
              zIndex: 30
            }}
          >
            <PhoneMockup3D
              scale={0.88}
              rotateY={0}
              rotateX={2}
              elevation={50}
            >
              <LandmarkDetailScreenView
                floor="B2"
                zone="Blue"
                slot="C-14"
                elapsedTime="1j 15m"
              />
            </PhoneMockup3D>
            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              📍 Live Navigation
            </div>
          </div>

          {/* Right Phone: 100% Offline */}
          <div
            style={{
              position: 'absolute',
              transform: `translateX(${rightX}px) translateY(80px)`,
              zIndex: 15
            }}
          >
            <PhoneMockup3D
              scale={0.78}
              rotateY={rightRotY}
              rotateX={4}
              elevation={35}
            >
              <OfflineSecurityScreenView mode="offline" />
            </PhoneMockup3D>
            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(36, 59, 61, 0.2)'
              }}
            >
              ⚡ 100% Offline Ready
            </div>
          </div>
        </div>
      </CameraRig>
    </div>
  )
}
