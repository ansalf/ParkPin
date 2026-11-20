import React from 'react'
import { Sequence } from 'remotion'
import { ProblemScene } from '../scenes/ProblemScene'
import { ProductRevealScene } from '../scenes/ProductRevealScene'
import { SaveParkingScene } from '../scenes/SaveParkingScene'
import { LandmarkScene } from '../scenes/LandmarkScene'
import { FindVehicleScene } from '../scenes/FindVehicleScene'
import { FeatureShowcaseScene } from '../scenes/FeatureShowcaseScene'
import { BrandFinaleScene } from '../scenes/BrandFinaleScene'

export const ParkPinCinematicVerticalV2: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0F1819',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '1920px',
          height: '1080px',
          transform: 'scale(1.0)',
          transformOrigin: 'center center',
          position: 'absolute'
        }}
      >
        <Sequence from={0} durationInFrames={240}>
          <ProblemScene />
        </Sequence>
        <Sequence from={240} durationInFrames={240}>
          <ProductRevealScene />
        </Sequence>
        <Sequence from={480} durationInFrames={420}>
          <SaveParkingScene />
        </Sequence>
        <Sequence from={900} durationInFrames={360}>
          <LandmarkScene />
        </Sequence>
        <Sequence from={1260} durationInFrames={480}>
          <FindVehicleScene />
        </Sequence>
        <Sequence from={1740} durationInFrames={420}>
          <FeatureShowcaseScene />
        </Sequence>
        <Sequence from={2160} durationInFrames={420}>
          <BrandFinaleScene />
        </Sequence>
      </div>
    </div>
  )
}
