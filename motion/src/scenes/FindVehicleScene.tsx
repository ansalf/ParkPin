import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { LandmarkDetailScreenView } from '../screens/LandmarkDetailScreenView'
import { FindVehicleScreenView } from '../screens/FindVehicleScreenView'
import { InteractionIndicator } from '../components/InteractionIndicator'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const FindVehicleScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera slow pan & dolly
  const cameraZ = interpolate(frame, [0, 480], [0, 35], {
    easing: MotionCurves.gentle
  })
  const panX = interpolate(frame, [0, 480], [-20, 20], {
    easing: MotionCurves.gentle
  })

  // Tap 1: Clicking "Cari Kendaraan Saya"
  const isNavigating = frame >= 65
  const tapProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120 }
  })
  const isTapPressed = frame >= 36 && frame <= 58

  // Compass Heading rotation (starts around 120°, swings smoothly to target 240°)
  const compassHeading = interpolate(frame, [70, 220], [140, 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })

  // Distance Countdown (meters: 58m -> 32m -> 12m -> 0m)
  const distance = Math.round(
    interpolate(frame, [80, 340], [58, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MotionCurves.easeInOutCubic
    })
  )

  const isArrived = distance === 0 && frame >= 340

  // Arrival celebration scale
  const arrivalSpring = spring({
    frame: frame - 340,
    fps,
    config: { damping: 12, stiffness: 140 }
  })

  // Floor navigation path pulse in background
  const pathOffset = (frame * 2.5) % 60

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1A2C2E',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Dynamic Background Navigational Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 60%, rgba(36, 59, 61, 0.6) 0%, rgba(15, 24, 25, 0.95) 75%),
            linear-gradient(to right, rgba(120, 155, 154, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 155, 154, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 60px 60px, 60px 60px',
          backgroundPosition: `0 0, 0px ${pathOffset}px, 0px 0px`
        }}
      />

      <CameraRig panX={panX} dollyZ={cameraZ}>
        {/* Kinetic Typography Left */}
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '110px',
            maxWidth: '560px',
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
            SMART COMPASS & ELEVATOR PROMPTS
          </div>

          <MaskedHeading
            text="Right where you left it."
            startFrame={15}
            fontSize="58px"
            color="#F5F3EE"
          />

          <p
            style={{
              fontSize: '18px',
              color: '#D9BFA3',
              lineHeight: 1.5,
              marginTop: '16px',
              fontWeight: 500
            }}
          >
            No searching aimlessly in huge parking basements. ParkPin guides you step-by-step
            to the exact elevator, pillar, and parking slot.
          </p>

          {/* Navigation telemetry indicators */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
              opacity: interpolate(frame, [80, 110], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(245, 243, 238, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                border: '1px solid rgba(245, 243, 238, 0.15)'
              }}
            >
              <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                ESTIMATED DISTANCE
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#10B981' }}>
                {distance} m
              </div>
            </div>

            <div
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(245, 243, 238, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                border: '1px solid rgba(245, 243, 238, 0.15)'
              }}
            >
              <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                HEADING BEARING
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#F5F3EE' }}>
                {Math.round(compassHeading)}° SW
              </div>
            </div>

            <div
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(245, 243, 238, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                border: '1px solid rgba(245, 243, 238, 0.15)'
              }}
            >
              <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                FLOOR LEVEL
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#D9BFA3' }}>
                Basement 2
              </div>
            </div>
          </div>
        </div>

        {/* 3D Phone Mockup on Right */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            right: '180px',
            transform: 'translateY(-50%)',
            zIndex: 20
          }}
        >
          <PhoneMockup3D
            scale={0.94}
            rotateY={interpolate(frame, [0, 480], [-6, 6])}
            rotateX={3}
            elevation={45}
          >
            {isNavigating ? (
              <FindVehicleScreenView
                heading={compassHeading}
                distanceMeters={distance}
                floor="B2"
                slot="C-14"
                arrived={isArrived}
              />
            ) : (
              <LandmarkDetailScreenView
                floor="B2"
                zone="Blue"
                slot="C-14"
                elapsedTime="42m"
                locatePressed={isTapPressed}
              />
            )}
          </PhoneMockup3D>

          {/* Tap Indicator on "Cari Kendaraan" */}
          {!isNavigating && frame <= 65 && (
            <div
              style={{
                position: 'absolute',
                bottom: '95px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              <InteractionIndicator
                progress={tapProgress}
                isPressed={isTapPressed}
                label="Cari Mobil"
              />
            </div>
          )}

          {/* Arrival Confetti / Popover Banner */}
          {isArrived && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${Math.max(0, arrivalSpring)})`,
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '18px 30px',
                borderRadius: '24px',
                boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                zIndex: 60,
                border: '2px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <span style={{ fontSize: '28px' }}>🚗</span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>Kendaraan Ditemukan!</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Pilar P-42 • Slot C-14
                </div>
              </div>
            </div>
          )}
        </div>
      </CameraRig>
    </div>
  )
}
