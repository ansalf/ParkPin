import React from 'react'
import { Sequence } from 'remotion'
import { ProductRevealScene } from '../scenes/ProductRevealScene'
import { SaveParkingScene } from '../scenes/SaveParkingScene'
import { LandmarkScene } from '../scenes/LandmarkScene'
import { FindVehicleScene } from '../scenes/FindVehicleScene'
import { HistoryWalkthroughScene } from '../scenes/HistoryWalkthroughScene'
import { BrandFinaleScene } from '../scenes/BrandFinaleScene'
import { AudioTimeline } from '../audio/AudioTimeline'
import { SubtitlesOverlay } from '../audio/SubtitlesOverlay'

export interface ParkPinMinimalWalkthroughV3Props {
  includeCaptions?: boolean
}

export const ParkPinMinimalWalkthroughV3: React.FC<ParkPinMinimalWalkthroughV3Props> = ({
  includeCaptions = false
}) => {
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
      {/* 1. Synchronized Audio & SFX Timeline */}
      <AudioTimeline />

      {/* 2. Visual Narrative Scenes */}
      {/* Scene 01: Introduction (0 - 4s, frames 0 - 240) */}
      <Sequence from={0} durationInFrames={240} name="Scene 01: Introduction">
        <ProductRevealScene />
      </Sequence>

      {/* Scene 02: Save Parking Location (4 - 12s, frames 240 - 720) */}
      <Sequence from={240} durationInFrames={480} name="Scene 02: Save Parking">
        <SaveParkingScene />
      </Sequence>

      {/* Scene 03: Landmark Details (12 - 18s, frames 720 - 1080) */}
      <Sequence from={720} durationInFrames={360} name="Scene 03: Landmark Details">
        <LandmarkScene />
      </Sequence>

      {/* Scene 04: Find My Vehicle (18 - 26s, frames 1080 - 1560) */}
      <Sequence from={1080} durationInFrames={480} name="Scene 04: Find Vehicle">
        <FindVehicleScene />
      </Sequence>

      {/* Scene 05: Parking History (26 - 32s, frames 1560 - 1920) */}
      <Sequence from={1560} durationInFrames={360} name="Scene 05: Parking History">
        <HistoryWalkthroughScene />
      </Sequence>

      {/* Scene 06: Closing (32 - 38s, frames 1920 - 2280) */}
      <Sequence from={1920} durationInFrames={360} name="Scene 06: Closing">
        <BrandFinaleScene />
      </Sequence>

      {/* 3. Optional Subtitles / Closed Captions */}
      {includeCaptions && <SubtitlesOverlay />}
    </div>
  )
}
