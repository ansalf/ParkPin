import React from 'react'
import { Composition } from 'remotion'
import { ParkPinMotionTest } from './ParkPinMotionTest'
import { ParkPinCinematicLaunchV2 } from './compositions/ParkPinCinematicLaunchV2'
import { ParkPinCinematicVerticalV2 } from './compositions/ParkPinCinematicVerticalV2'
import { ParkPinMinimalWalkthroughV3 } from './compositions/ParkPinMinimalWalkthroughV3'
import { ParkPinCleanWalkthrough } from './compositions/ParkPinCleanWalkthrough'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Clean, Steady Walkthrough - No Zoom, No Audio, No Subtitles (30s @ 30 FPS = 900 frames) */}
      <Composition
        id="ParkPinCleanWalkthrough"
        component={ParkPinCleanWalkthrough}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Original Test Composition preserved */}
      <Composition
        id="ParkPinMotionTest"
        component={ParkPinMotionTest}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Flagship Cinematic Product Film V2 (43 seconds @ 60 FPS = 2580 frames) */}
      <Composition
        id="ParkPinCinematicLaunchV2"
        component={ParkPinCinematicLaunchV2}
        durationInFrames={2580}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* Vertical 9:16 Social & Mobile Edition (43 seconds @ 60 FPS = 2580 frames) */}
      <Composition
        id="ParkPinCinematicVerticalV2"
        component={ParkPinCinematicVerticalV2}
        durationInFrames={2580}
        fps={60}
        width={1080}
        height={1920}
      />

      {/* Minimal Walkthrough V3 with Full Sound (38.0s @ 60 FPS = 2280 frames) */}
      <Composition
        id="ParkPinMinimalWalkthroughV3Sound"
        component={ParkPinMinimalWalkthroughV3}
        durationInFrames={2280}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          includeCaptions: false
        }}
      />

      {/* Minimal Walkthrough V3 with Sound & Burned-in Subtitles (38.0s @ 60 FPS = 2280 frames) */}
      <Composition
        id="ParkPinMinimalWalkthroughV3Captioned"
        component={ParkPinMinimalWalkthroughV3}
        durationInFrames={2280}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          includeCaptions: true
        }}
      />
    </>
  )
}
