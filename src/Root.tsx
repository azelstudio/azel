import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
export const Root: React.FC = () => (
  <>
    <Composition
      id="AzelFilmVertical"
      component={Film}
      durationInFrames={720}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ short: false, sound: true }}
    />
    <Composition
      id="AzelShortVertical"
      component={Film}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ short: true, sound: true }}
    />
    <Composition
      id="AzelFilmFeed"
      component={Film}
      durationInFrames={720}
      fps={30}
      width={1080}
      height={1350}
      defaultProps={{ short: false, sound: true }}
    />
    <Composition
      id="AzelFilmWide"
      component={Film}
      durationInFrames={720}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ short: false, sound: true }}
    />
  </>
);
