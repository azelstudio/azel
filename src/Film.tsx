import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { scenes } from "./theme";
import {
  Signature,
  Gallery,
  PersonalizeName,
  PersonalizeColor,
  Responsive,
  Ownership,
  Closing,
} from "./scenes/Scenes";

export type FilmProps = { short?: boolean; sound?: boolean };
const components = [
  Signature,
  Gallery,
  PersonalizeName,
  PersonalizeColor,
  Responsive,
  Ownership,
  Closing,
];

const SceneSound: React.FC<{ index: number; duration: number }> = ({
  index,
  duration,
}) => {
  if (index === 0) return null;
  if (index === 3) {
    return (
      <>
        {[12, 35, 58, 81].map((t) => (
          <Sequence key={t} from={Math.round((t / 105) * duration)}>
            <Audio src={staticFile("sfx/tactile-click.wav")} volume={0.18} />
          </Sequence>
        ))}
      </>
    );
  }
  const from =
    index === 2
      ? Math.round((22 / 120) * duration)
      : index === 6
        ? Math.round((84 / 135) * duration)
        : 0;
  const source =
    index === 2 ? "tactile-click" : index === 6 ? "sonic-logo" : "soft-sweep";
  return (
    <Sequence from={from}>
      <Audio
        src={staticFile(`sfx/${source}.wav`)}
        volume={index === 6 ? 0.3 : 0.18}
      />
    </Sequence>
  );
};

export const Film: React.FC<FilmProps> = ({ short = false, sound = true }) => {
  const [handle] = useState(() => delayRender("Load local Azel brand font"));
  useEffect(() => {
    const face = new FontFace(
      "Instrument Sans",
      `url(${staticFile("fonts/instrument-sans.woff2")})`,
      { weight: "400 700" },
    );
    face
      .load()
      .then((font) => {
        document.fonts.add(font);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [handle]);
  let start = 0;
  return (
    <AbsoluteFill style={{ background: "#080808" }}>
      {scenes.map((scene, index) => {
        const from = start;
        const duration = short ? scene.short : scene.frames;
        start += duration;
        const Scene = components[index];
        return (
          <Sequence key={scene.key} from={from} durationInFrames={duration}>
            <Scene duration={duration} />
            {sound && <SceneSound index={index} duration={duration} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
