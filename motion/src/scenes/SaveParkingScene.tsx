import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { PhoneMockup3D } from '../components/PhoneMockup3D'
import { HomeScreenEmpty } from '../screens/HomeScreenEmpty'
import { SaveSpotScreenView } from '../screens/SaveSpotScreenView'
import { FloatingUICard } from '../components/FloatingUICard'
import { InteractionIndicator } from '../components/InteractionIndicator'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const SaveParkingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera pan & dolly
  const cameraZ = interpolate(frame, [0, 420], [0, 30], {
    easing: MotionCurves.gentle
  })

  // Phase 1: Tap to open form (frames 0 to 80)
  const isFormOpen = frame >= 70

  // Tap 1 animation (tapping "Simpan Titik Parkir Baru" on HomeScreen)
  const tap1Progress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 100 }
  })
  const isTap1Pressed = frame >= 48 && frame <= 68

  // Tap 2 animation (tapping "Simpan Titik Parkir" button at bottom of form)
  const tap2Progress = spring({
    frame: frame - 320,
    fps,
    config: { damping: 14, stiffness: 100 }
  })
  const isTap2Pressed = frame >= 345 && frame <= 370

  // 3D Breakout Cards timing (frames 120 to 300)
  // Card 1: Floor B2
  const card1Spring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 14, stiffness: 110 }
  })
  const card1Return = interpolate(frame, [260, 295], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })
  const card1X = interpolate(card1Return, [0, 1], [-260, 0])
  const card1Y = interpolate(card1Return, [0, 1], [-80, 0])
  const card1Scale = interpolate(card1Return, [0, 1], [1.15, 0.4]) * Math.max(0, card1Spring)
  const card1Elevation = interpolate(card1Return, [0, 1], [90, 0])
  const card1Opacity = interpolate(
    frame,
    [105, 120, 290, 305],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Card 2: Zone Blue
  const card2Spring = spring({
    frame: frame - 145,
    fps,
    config: { damping: 14, stiffness: 110 }
  })
  const card2Return = interpolate(frame, [270, 305], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })
  const card2X = interpolate(card2Return, [0, 1], [270, 0])
  const card2Y = interpolate(card2Return, [0, 1], [-40, 0])
  const card2Scale = interpolate(card2Return, [0, 1], [1.12, 0.4]) * Math.max(0, card2Spring)
  const card2Elevation = interpolate(card2Return, [0, 1], [80, 0])
  const card2Opacity = interpolate(
    frame,
    [140, 155, 300, 315],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Card 3: Slot C-14
  const card3Spring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 14, stiffness: 110 }
  })
  const card3Return = interpolate(frame, [280, 315], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })
  const card3X = interpolate(card3Return, [0, 1], [250, 0])
  const card3Y = interpolate(card3Return, [0, 1], [130, 0])
  const card3Scale = interpolate(card3Return, [0, 1], [1.1, 0.4]) * Math.max(0, card3Spring)
  const card3Elevation = interpolate(card3Return, [0, 1], [70, 0])
  const card3Opacity = interpolate(
    frame,
    [175, 190, 310, 325],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Saved Confirmation Badge
  const isSaved = frame >= 365
  const savedScale = spring({
    frame: frame - 365,
    fps,
    config: { damping: 12, stiffness: 140 }
  })

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
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse, #E2ECE9 0%, #F5F3EE 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <CameraRig dollyZ={cameraZ}>
        {/* Top / Left kinetic typography */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '100px',
            maxWidth: '520px',
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
            SMART AUTO-DETECTION & PRESETS
          </div>

          <MaskedHeading
            text="One tap. Your spot, saved."
            startFrame={15}
            fontSize="56px"
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
            No complex signups or clunky maps. Pick your floor level, color zone, and pillar
            number in seconds.
          </p>
        </div>

        {/* Center: 3D Phone Mockup */}
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
            rotateY={interpolate(frame, [0, 420], [-6, 4])}
            rotateX={3}
            elevation={40}
          >
            {isFormOpen ? (
              <SaveSpotScreenView
                floor="B2"
                zone="Blue"
                slot="C-14"
                submitPressed={isTap2Pressed}
              />
            ) : (
              <HomeScreenEmpty buttonPressed={isTap1Pressed} />
            )}
          </PhoneMockup3D>

          {/* Tap Indicator 1: Clicking HomeScreen button */}
          {!isFormOpen && (
            <div
              style={{
                position: 'absolute',
                top: '64%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              <InteractionIndicator
                progress={tap1Progress}
                isPressed={isTap1Pressed}
                label="Simpan Titik"
              />
            </div>
          )}

          {/* Tap Indicator 2: Clicking Submit in form */}
          {isFormOpen && frame >= 315 && frame <= 390 && (
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
                progress={tap2Progress}
                isPressed={isTap2Pressed}
                label="Simpan"
              />
            </div>
          )}

          {/* Saved Notification Popover */}
          {isSaved && (
            <div
              style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${Math.max(0, savedScale)})`,
                backgroundColor: '#243B3D',
                color: '#F5F3EE',
                padding: '16px 28px',
                borderRadius: '20px',
                border: '2px solid #D9BFA3',
                boxShadow: '0 20px 50px rgba(36, 59, 61, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 60
              }}
            >
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>Spot Tersimpan!</div>
                <div style={{ fontSize: '11px', color: '#D9BFA3' }}>
                  Lantai B2 • Zona Blue • C-14
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Breakout Floating UI Cards */}
        {card1Opacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '45%',
              right: '180px',
              transform: `translate(${card1X}px, ${card1Y}px)`,
              opacity: card1Opacity,
              zIndex: 35
            }}
          >
            <FloatingUICard
              elevation={card1Elevation}
              scale={card1Scale}
              rotateY={-12}
              rotateZ={-6}
              glowColor="rgba(36, 59, 61, 0.25)"
            >
              <div style={{ width: '190px' }}>
                <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                  LANTAI TERDETEKSI
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#243B3D' }}>
                  Level B2
                </div>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
                  ✓ Basement Utama
                </div>
              </div>
            </FloatingUICard>
          </div>
        )}

        {card2Opacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '32%',
              right: '180px',
              transform: `translate(${card2X}px, ${card2Y}px)`,
              opacity: card2Opacity,
              zIndex: 35
            }}
          >
            <FloatingUICard
              elevation={card2Elevation}
              scale={card2Scale}
              rotateY={14}
              rotateZ={5}
              glowColor="rgba(37, 99, 235, 0.25)"
            >
              <div style={{ width: '190px' }}>
                <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                  ZONA AREA
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB'
                    }}
                  />
                  Zone Blue
                </div>
                <div style={{ fontSize: '11px', color: '#789B9A', fontWeight: 700 }}>
                  Dekat Pintu Timur
                </div>
              </div>
            </FloatingUICard>
          </div>
        )}

        {card3Opacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '58%',
              right: '180px',
              transform: `translate(${card3X}px, ${card3Y}px)`,
              opacity: card3Opacity,
              zIndex: 35
            }}
          >
            <FloatingUICard
              elevation={card3Elevation}
              scale={card3Scale}
              rotateY={-8}
              rotateZ={-3}
              glowColor="rgba(217, 191, 163, 0.35)"
            >
              <div style={{ width: '190px' }}>
                <div style={{ fontSize: '10px', color: '#789B9A', fontWeight: 800 }}>
                  SLOT & TIANG
                </div>
                <div style={{ fontSize: '30px', fontWeight: 900, color: '#243B3D' }}>
                  C-14
                </div>
                <div style={{ fontSize: '11px', color: '#D9BFA3', fontWeight: 800 }}>
                  Pilar P-42
                </div>
              </div>
            </FloatingUICard>
          </div>
        )}
      </CameraRig>
    </div>
  )
}
