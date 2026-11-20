import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { HistoryScreenView } from '../screens/HistoryScreenView'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const HistoryWalkthroughScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera subtle pan & dolly
  const cameraZ = interpolate(frame, [0, 360], [0, 25], {
    easing: MotionCurves.gentle
  })
  const panX = interpolate(frame, [0, 360], [-15, 15], {
    easing: MotionCurves.gentle
  })

  // Phone entrance
  const phoneEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 95 }
  })
  const phoneY = interpolate(phoneEntrance, [0, 1], [300, 0])
  const phoneRotY = interpolate(phoneEntrance, [0, 1], [24, -4])

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
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse, #E2ECE9 0%, #F5F3EE 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none'
        }}
      />

      <CameraRig panX={panX} dollyZ={cameraZ}>
        {/* Kinetic Typography Left */}
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '110px',
            maxWidth: '540px',
            zIndex: 10
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#789B9A',
              marginBottom: '12px'
            }}
          >
            ACTIVITY LOG & PRIVACY
          </div>

          <MaskedHeading
            text="Your parking history, organized."
            startFrame={15}
            fontSize="54px"
            color="#243B3D"
          />

          <p
            style={{
              fontSize: '18px',
              color: '#789B9A',
              lineHeight: 1.5,
              marginTop: '16px',
              fontWeight: 500
            }}
          >
            Review all your past spots, parking durations, and location notes anytime in one
            centralized, offline-accessible log.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '28px',
              opacity: interpolate(frame, [60, 85], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              🔒 100% Stored on Device
            </div>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#E2ECE9',
                color: '#243B3D',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              ⏱️ Elapsed Time Trackers
            </div>
          </div>
        </div>

        {/* 3D Phone Mockup Right */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            right: '200px',
            transform: `translateY(-50%) translateY(${phoneY}px)`,
            zIndex: 20
          }}
        >
          <PhoneMockup3D
            scale={0.92}
            rotateY={phoneRotY}
            rotateX={3}
            elevation={45}
          >
            <HistoryScreenView />
          </PhoneMockup3D>
        </div>
      </CameraRig>
    </div>
  )
}
