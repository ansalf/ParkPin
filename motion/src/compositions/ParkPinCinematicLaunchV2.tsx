import React from 'react'
import { Sequence } from 'remotion'
import { ProblemScene } from '../scenes/ProblemScene'
import { ProductRevealScene } from '../scenes/ProductRevealScene'
import { SaveParkingScene } from '../scenes/SaveParkingScene'
import { LandmarkScene } from '../scenes/LandmarkScene'
import { FindVehicleScene } from '../scenes/FindVehicleScene'
import { FeatureShowcaseScene } from '../scenes/FeatureShowcaseScene'
import { BrandFinaleScene } from '../scenes/BrandFinaleScene'

export const ParkPinCinematicLaunchV2: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0F1819',
        overflow: 'hidden'
      }}
    >
      {/* Scene 01: The Problem (0 - 4s, frames 0 - 240) */}
      <Sequence from={0} durationInFrames={240} name="Scene 01: The Problem">
        <ProblemScene />
      </Sequence>

      {/* Scene 02: Product Reveal (4 - 8s, frames 240 - 480) */}
      <Sequence from={240} durationInFrames={240} name="Scene 02: Product Reveal">
        <ProductRevealScene />
      </Sequence>

      {/* Scene 03: Pin Your Spot (8 - 15s, frames 480 - 900) */}
      <Sequence from={480} durationInFrames={420} name="Scene 03: Pin Your Spot">
        <SaveParkingScene />
      </Sequence>

      {/* Scene 04: Remember Landmark (15 - 21s, frames 900 - 1260) */}
      <Sequence from={900} durationInFrames={360} name="Scene 04: Remember Landmark">
        <LandmarkScene />
      </Sequence>

      {/* Scene 05: Find Vehicle (21 - 29s, frames 1260 - 1740) */}
      <Sequence from={1260} durationInFrames={480} name="Scene 05: Find Vehicle">
        <FindVehicleScene />
      </Sequence>

      {/* Scene 06: Feature Showcase (29 - 36s, frames 1740 - 2160) */}
      <Sequence from={1740} durationInFrames={420} name="Scene 06: Feature Showcase">
        <FeatureShowcaseScene />
      </Sequence>

      {/* Scene 07: Brand Finale (36 - 43s, frames 2160 - 2580) */}
      <Sequence from={2160} durationInFrames={420} name="Scene 07: Brand Finale">
        <BrandFinaleScene />
      </Sequence>
    </div>
  )
}
