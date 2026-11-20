import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { LandmarkDetailScreenView } from '../screens/LandmarkDetailScreenView'
import { SaveSpotScreenView } from '../screens/SaveSpotScreenView'
import { FloatingUICard } from '../components/FloatingUICard'
import { InteractionIndicator } from '../components/InteractionIndicator'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const LandmarkScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera zoom / push-in on phone
  const dolly = interpolate(frame, [0, 360], [40, 75], {
    easing: MotionCurves.gentle
  })
  const panX = interpolate(frame, [0, 360], [-60, -90], {
    easing: MotionCurves.gentle
  })

  // Tap camera trigger (frames 20 - 45)
  const tapProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120 }
  })
  const isTapPressed = frame >= 32 && frame <= 46

  // Shutter Flash Effect (frames 45 - 65)
  const flashOpacity = interpolate(frame, [45, 48, 62], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // Has Photo captured state
  const hasCaptured = frame >= 48

  // 3D Photo Breakout expansion (frames 60 to 240)
  const photoExpandSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 14, stiffness: 100 }
  })

  // Docking back to phone (frames 240 to 290)
  const dockProgress = interpolate(frame, [235, 275], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })

  const photoCardX = interpolate(dockProgress, [0, 1], [-260, 0])
  const photoCardY = interpolate(dockProgress, [0, 1], [30, 0])
  const photoCardScale = interpolate(dockProgress, [0, 1], [1.28, 0.5])
  const photoCardElevation = interpolate(dockProgress, [0, 1], [95, 0])
  const photoCardOpacity = interpolate(
    frame,
    [50, 65, 270, 285],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

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
          left: '40%',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, #E2ECE9 0%, #F5F3EE 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none'
        }}
      />

      <CameraRig panX={panX} dollyZ={dolly}>
        {/* Kinetic Typography Left */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '100px',
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
            VISUAL LANDMARK CAPTURE
          </div>

          <MaskedHeading
            text="Every detail, remembered."
            startFrame={15}
            fontSize="58px"
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
            Snap the nearest pillar, elevator entrance, or parking sign. ParkPin pairs your
            coordinates with crystal-clear visual proof.
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
              📸 High-Res Photo Storage
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
              🏷️ Smart Auto-Tagging
            </div>
          </div>
        </div>

        {/* 3D Phone Mockup on Right */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            right: '220px',
            transform: 'translateY(-50%)',
            zIndex: 20
          }}
        >
          <PhoneMockup3D
            scale={0.96}
            rotateY={interpolate(frame, [0, 360], [-8, 2])}
            rotateX={4}
            elevation={42}
          >
            {hasCaptured ? (
              <LandmarkDetailScreenView
                floor="B2"
                zone="Blue"
                slot="C-14"
                elapsedTime="0m"
              />
            ) : (
              <SaveSpotScreenView
                floor="B2"
                zone="Blue"
                slot="C-14"
                hasPhoto={false}
              />
            )}
          </PhoneMockup3D>

          {/* Camera Tap Indicator (frame 15 to 50) */}
          {!hasCaptured && (
            <div
              style={{
                position: 'absolute',
                top: '46%',
                right: '40px',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              <InteractionIndicator
                progress={tapProgress}
                isPressed={isTapPressed}
                label="Ambil Foto"
              />
            </div>
          )}
        </div>

        {/* 3D Breakout Floating Photo Card */}
        {photoCardOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '44%',
              right: '220px',
              transform: `translate(${photoCardX}px, ${photoCardY}px)`,
              opacity: photoCardOpacity,
              zIndex: 35
            }}
          >
            <FloatingUICard
              elevation={photoCardElevation}
              scale={photoCardScale * photoExpandSpring}
              rotateY={-14}
              rotateX={6}
              glowColor="rgba(36, 59, 61, 0.35)"
            >
              <div
                style={{
                  width: '260px',
                  backgroundColor: '#243B3D',
                  borderRadius: '16px',
                  padding: '16px',
                  color: '#F5F3EE',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#D9BFA3',
                      letterSpacing: '0.05em'
                    }}
                  >
                    LANDMARK PATOKAN
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#2563EB',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: 800
                    }}
                  >
                    Zona Blue
                  </span>
                </div>

                {/* Pillar Graphic */}
                <div
                  style={{
                    backgroundColor: '#F5F3EE',
                    borderRadius: '12px',
                    padding: '20px 10px',
                    textAlign: 'center',
                    border: '2px solid #243B3D'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                    NOMOR TIANG
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#243B3D' }}>
                    P-42
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#2563EB',
                      marginTop: '4px'
                    }}
                  >
                    Dekat Lift Lobi Utama
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#D9BFA3',
                    fontWeight: 600
                  }}
                >
                  <span>Lantai B2</span>
                  <span>Grand Indonesia</span>
                </div>
              </div>
            </FloatingUICard>
          </div>
        )}

        {/* Shutter Camera Flash Overlay */}
        {flashOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFFFFF',
              opacity: flashOpacity,
              zIndex: 100,
              pointerEvents: 'none'
            }}
          />
        )}
      </CameraRig>
    </div>
  )
}
