import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { CameraRig } from '../components/CameraRig'
import { MaskedHeading } from '../components/KineticTypography'
import { MotionCurves } from '../animations/easing'

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera push-in through the dark garage
  const cameraZ = interpolate(frame, [0, 240], [0, 80], {
    easing: MotionCurves.gentle
  })
  const cameraY = interpolate(frame, [0, 240], [0, -20])

  // Floating parking fragments animation
  const fragments = [
    { text: 'B2', x: -420, y: -160, z: 40, rot: -12, delay: 10 },
    { text: 'ZONE BLUE', x: 380, y: -120, z: -20, rot: 8, delay: 25 },
    { text: 'SLOT C-14', x: -320, y: 180, z: 60, rot: 15, delay: 40 },
    { text: 'LEVEL 04', x: 420, y: 200, z: 10, rot: -8, delay: 55 },
    { text: 'PILAR 42', x: -140, y: -260, z: -30, rot: 6, delay: 70 },
    { text: 'TIANG B3', x: 260, y: -240, z: 50, rot: -14, delay: 85 }
  ]

  // Convergence toward center pin at the end of scene (frames 170 - 240)
  const convergeProgress = interpolate(frame, [170, 225], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MotionCurves.easeOutQuart
  })

  // Center Pin Reveal & Morph
  const pinScale = spring({
    frame: frame - 180,
    fps,
    config: { damping: 14, stiffness: 120 }
  })
  const pinOpacity = interpolate(frame, [175, 195], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // Grid floor perspective offset
  const gridOffset = (frame * 1.5) % 80

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0F1819',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <CameraRig panY={cameraY} dollyZ={cameraZ}>
        {/* 3D Atmospheric Grid Floor */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40%',
            left: '-20%',
            width: '140%',
            height: '100%',
            transform: 'rotateX(78deg)',
            transformOrigin: 'bottom center',
            backgroundImage: `
              linear-gradient(to right, rgba(120, 155, 154, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(120, 155, 154, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: `0px ${gridOffset}px`,
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
          }}
        />

        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(36, 59, 61, 0.45) 0%, rgba(15, 24, 25, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        {/* Oversized Main Typography */}
        <div
          style={{
            position: 'absolute',
            top: '28%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            width: '100%'
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#789B9A',
              marginBottom: '16px',
              opacity: interpolate(frame, [15, 35], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }}
          >
            The Parking Dilemma
          </div>

          <MaskedHeading
            text="Where did I park?"
            startFrame={30}
            fontSize="84px"
            color="#F5F3EE"
          />

          <p
            style={{
              margin: '20px auto 0',
              maxWidth: '680px',
              fontSize: '22px',
              fontWeight: 500,
              color: '#D9BFA3',
              lineHeight: 1.4,
              opacity: interpolate(frame, [60, 85], [0, 0.9], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              })
            }}
          >
            Thousands of slots. Multiple levels. Zero signal.
          </p>
        </div>

        {/* Scattered Parking Fragments */}
        {fragments.map((frag, i) => {
          const fragSpring = spring({
            frame: frame - frag.delay,
            fps,
            config: { damping: 15, stiffness: 100 }
          })
          const fragOpacity = interpolate(
            frame,
            [frag.delay, frag.delay + 20, 180, 215],
            [0, 0.85, 0.85, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )

          // Convergence interpolation towards (0, 0)
          const curX = interpolate(convergeProgress, [0, 1], [frag.x, 0])
          const curY = interpolate(convergeProgress, [0, 1], [frag.y, 0])
          const curZ = interpolate(convergeProgress, [0, 1], [frag.z, 0])
          const curRot = interpolate(convergeProgress, [0, 1], [frag.rot, 0])
          const curScale = fragSpring * (1 - convergeProgress * 0.7)

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate3d(${curX}px, ${curY}px, ${curZ}px) rotate(${curRot}deg) scale(${curScale})`,
                opacity: fragOpacity,
                backgroundColor: 'rgba(36, 59, 61, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(217, 191, 163, 0.35)',
                color: '#F5F3EE',
                padding: '12px 22px',
                borderRadius: '16px',
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                pointerEvents: 'none'
              }}
            >
              {frag.text}
            </div>
          )
        })}

        {/* Convergence Location Pin Icon */}
        {frame >= 170 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${Math.max(0, pinScale)})`,
              opacity: pinOpacity,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#243B3D',
                border: '4px solid #D9BFA3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 50px rgba(217, 191, 163, 0.6)'
              }}
            >
              <span style={{ fontSize: '46px', color: '#F5F3EE' }}>📍</span>
            </div>
            <div
              style={{
                marginTop: '16px',
                fontSize: '18px',
                fontWeight: 900,
                color: '#F5F3EE',
                letterSpacing: '0.1em'
              }}
            >
              FOUND
            </div>
          </div>
        )}
      </CameraRig>
    </div>
  )
}
