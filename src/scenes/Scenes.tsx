import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { brand, clamp } from "../theme";
import {
  Browser,
  Caption,
  Cursor,
  Mark,
  SceneFrame,
  Sweep,
  Title,
  Wordmark,
  easeOut,
  useLayout,
} from "../components/Primitives";
type SceneProps = { duration: number };
export const Signature: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = useCurrentFrame(),
    p = easeOut(interpolate(f, [0, 30], [0, 1], clamp));
  return (
    <SceneFrame footer={false}>
      <Title
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * 0.14,
          maxWidth: l.wide ? l.w * 0.47 : l.w * 0.86,
        }}
      >
        {l.wide ? (
          <>
            Votre futur
            <br />
            site.
          </>
        ) : (
          <>
            Votre futur
            <br />
            site.
          </>
        )}
      </Title>
      <div
        style={{
          position: "absolute",
          width: l.w * (l.wide ? 0.39 : 0.8),
          left: l.w * (l.wide ? 0.55 : 0.1),
          top: l.h * (l.wide ? 0.12 : l.compact ? 0.35 : 0.34),
          transform: `translateY(${(1 - p) * 44}px) scale(${0.95 + p * 0.05}) rotate(${(1 - p) * -3}deg)`,
        }}
      >
        <Img
          src={staticFile("brand/poster.jpg")}
          style={{ width: "100%", mixBlendMode: "lighten" }}
        />
        <Sweep frame={f - 12} duration={duration - 22} />
      </div>
      <Wordmark
        size={l.wide ? 31 : l.w * 0.036}
        style={{ position: "absolute", left: l.pad, bottom: l.h * 0.1 }}
      />
    </SceneFrame>
  );
};
export const Gallery: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = useCurrentFrame(),
    p = easeOut(interpolate(f, [0, 23], [0, 1], clamp));
  const top = l.wide ? l.h * 0.16 : l.h * (l.compact ? 0.32 : 0.29),
    w = l.wide ? l.w * 0.45 : l.w * 0.82;
  return (
    <SceneFrame>
      <Title
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * 0.13,
          zIndex: 5,
        }}
      >
        Essayez-le.
      </Title>
      <div
        style={{
          position: "absolute",
          left: l.w * (l.wide ? 0.48 : 0.09),
          top,
          width: w,
          perspective: 1600,
          transform: `translateY(${(1 - p) * 75}px)`,
        }}
      >
        <Browser
          src="showroom/sr-pilates.webp"
          style={{
            position: "relative",
            transform: `rotateY(${-7 + p * 4}deg) rotateZ(-3deg) scale(${0.94 + p * 0.06})`,
            zIndex: 1,
          }}
        />
        <Browser
          src="showroom/sr-ramen.jpg"
          style={{
            position: "absolute",
            width: "67%",
            left: "-5%",
            top: l.wide ? 210 : l.compact ? 210 : 330,
            transform: `translateX(${(1 - p) * -80}px) rotateZ(4deg)`,
            zIndex: 2,
          }}
        />
        <Browser
          src="showroom/sr-depart.jpg"
          style={{
            position: "absolute",
            width: "70%",
            left: "38%",
            top: l.wide ? 280 : l.compact ? 300 : 470,
            transform: `translateX(${(1 - p) * 80}px) rotateZ(-5deg)`,
            zIndex: 3,
          }}
        />
      </div>
      <Caption
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.62 : 0.82),
        }}
      >
        Des créations à essayer.
        <br />
        Concepts du showroom.
      </Caption>
    </SceneFrame>
  );
};
const Editor: React.FC<{
  name: string;
  activeColor?: number;
  focus?: boolean;
  style?: React.CSSProperties;
}> = ({ name, activeColor = 0, focus = false, style }) => {
  const l = useLayout();
  return (
    <div
      style={{
        background: brand.ivory,
        color: brand.black,
        padding: l.wide ? 26 : 34,
        borderRadius: 24,
        boxShadow: "0 24px 60px -20px rgba(0,0,0,.8)",
        border: "1px solid rgba(255,255,255,.35)",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: l.wide ? 19 : 25,
          marginBottom: 14,
          fontWeight: 500,
        }}
      >
        Votre entreprise
      </div>
      <div
        style={{
          padding: "15px 18px",
          fontSize: l.wide ? 26 : 32,
          lineHeight: 1.2,
          borderRadius: 12,
          border: `${focus ? 2 : 1}px solid ${focus ? "#52654C" : "#C5C2BB"}`,
          background: "#FBF9F4",
          whiteSpace: "nowrap",
        }}
      >
        {name || "Votre nom"}
        {focus && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 30,
              background: "#52654C",
              verticalAlign: "middle",
              marginLeft: 4,
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
        {[brand.olive, brand.ink, brand.clay, brand.plum].map((c, i) => (
          <div
            key={c}
            style={{
              width: l.wide ? 42 : 56,
              height: l.wide ? 42 : 56,
              borderRadius: "50%",
              background: c,
              outline: activeColor === i ? "2px solid #303C2F" : "none",
              outlineOffset: 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};
export const PersonalizeName: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = (useCurrentFrame() * 120) / duration,
    n = "Studio Lumière",
    count = Math.floor(interpolate(f, [28, 68], [0, n.length], clamp)),
    ready = f >= 70,
    p = easeOut(interpolate(f, [0, 17], [0, 1], clamp));
  const x = l.w * (l.wide ? 0.48 : 0.075),
    y = l.h * (l.wide ? 0.18 : l.compact ? 0.32 : 0.32),
    w = l.w * (l.wide ? 0.48 : 0.85);
  const ex = l.w * (l.wide ? 0.6 : 0.19),
    ey = l.h * (l.wide ? 0.6 : l.compact ? 0.65 : 0.62);
  return (
    <SceneFrame>
      <Title
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * 0.12,
          maxWidth: l.w * 0.7,
        }}
      >
        Votre nom.
      </Title>
      <Caption
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.42 : 0.235),
        }}
      >
        Le site prend votre identité.
      </Caption>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          transform: `perspective(1800px) rotateY(-4deg) translateY(${(1 - p) * 35}px)`,
        }}
      >
        <Browser src="screens/pilates-olive.png" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${100 - interpolate(f, [70, 86], [0, 100], clamp)}% 0 0)`,
          }}
        >
          <Browser src="screens/pilates-name.png" />
        </div>
      </div>
      <Editor
        name={n.slice(0, count)}
        focus={f >= 22 && f < 91}
        style={{
          position: "absolute",
          left: ex,
          top: ey,
          width: l.w * (l.wide ? 0.33 : 0.72),
          transform: `translateY(${(1 - p) * 30}px)`,
        }}
      />
      <Cursor
        x={l.w * (l.wide ? 0.73 : 0.58)}
        y={ey + (l.wide ? 72 : 90)}
        click={f > 19 && f < 31 ? (f - 19) / 12 : 0}
      />
      {ready && !l.compact && (
        <Caption style={{ position: "absolute", left: l.pad, top: l.h * 0.84 }}>
          Aperçu personnalisé.
        </Caption>
      )}
    </SceneFrame>
  );
};
export const PersonalizeColor: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = (useCurrentFrame() * 105) / duration;
  const colors = [
    "pilates-name",
    "pilates-ink",
    "pilates-clay",
    "pilates-plum",
  ];
  const active = Math.min(3, Math.floor(Math.max(0, f - 12) / 23));
  const left = l.w * (l.wide ? 0.48 : 0.075),
    top = l.h * (l.wide ? 0.18 : l.compact ? 0.3 : 0.3),
    ex = l.w * (l.wide ? 0.6 : 0.18),
    ey = l.h * (l.wide ? 0.62 : l.compact ? 0.63 : 0.62);
  return (
    <SceneFrame>
      <Title style={{ position: "absolute", left: l.pad, top: l.h * 0.12 }}>
        Vos couleurs.
      </Title>
      <Caption
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.42 : 0.235),
        }}
      >
        Une ambiance qui vous ressemble.
      </Caption>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: l.w * (l.wide ? 0.48 : 0.85),
          transform: "perspective(1800px) rotateY(-4deg)",
        }}
      >
        <Browser src={`screens/${colors[active]}.png`} />
        <Sweep frame={(f - 12) % 23} duration={15} />
      </div>
      <Editor
        name="Studio Lumière"
        activeColor={active}
        style={{
          position: "absolute",
          left: ex,
          top: ey,
          width: l.w * (l.wide ? 0.33 : 0.72),
        }}
      />
      <Cursor
        x={ex + (l.wide ? 47 : 64) + active * (l.wide ? 62 : 76)}
        y={ey + (l.wide ? 155 : 190)}
        click={f > 12 ? ((f - 12) % 23) / 23 : 0}
      />
    </SceneFrame>
  );
};
export const Responsive: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = (useCurrentFrame() * 105) / duration,
    p = easeOut(interpolate(f, [9, 36], [0, 1], clamp));
  return (
    <SceneFrame>
      <Title
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * 0.12,
          fontSize: l.wide ? l.head : l.head * 0.91,
          maxWidth: l.wide ? l.w * 0.4 : l.w * 0.86,
        }}
      >
        Sur tous
        <br />
        les écrans.
      </Title>
      <Browser
        src="screens/pilates-name.png"
        style={{
          position: "absolute",
          left: l.w * (l.wide ? 0.48 : 0.075),
          top: l.h * (l.wide ? 0.2 : l.compact ? 0.36 : 0.37),
          width: l.w * (l.wide ? 0.46 : 0.85),
          transform: "perspective(1600px) rotateY(-5deg) rotateZ(-2deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: l.w * (l.wide ? 0.73 : 0.55),
          top: l.h * (l.wide ? 0.34 : l.compact ? 0.42 : 0.45),
          width: l.w * (l.wide ? 0.15 : 0.33),
          borderRadius: l.w * 0.035,
          padding: l.w * 0.008,
          background: "#151617",
          border: "1px solid #666",
          boxShadow: "0 45px 90px -20px rgba(0,0,0,.85)",
          transform: `translateY(${(1 - p) * 100}px) rotateZ(${3 * p}deg)`,
          opacity: p,
        }}
      >
        <div
          style={{
            borderRadius: l.w * 0.028,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img
            src={staticFile("screens/pilates-mobile.png")}
            style={{ display: "block", width: "100%" }}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              left: "36%",
              width: "28%",
              height: 12,
              borderRadius: 12,
              background: "#080808",
            }}
          />
        </div>
      </div>
      <Caption
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.68 : 0.84),
        }}
      >
        Pensé aussi pour le mobile.
        <br />
        Concept de démonstration.
      </Caption>
    </SceneFrame>
  );
};
export const Ownership: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = (useCurrentFrame() * 90) / duration,
    p = easeOut(interpolate(f, [0, 28], [0, 1], clamp));
  return (
    <SceneFrame>
      <Title
        size={l.wide ? l.w * 0.089 : l.w * 0.126}
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.28 : 0.24),
          maxWidth: l.w * 0.85,
        }}
      >
        Il vous
        <br />
        appartient.
      </Title>
      <div
        style={{
          position: "absolute",
          left: l.w * (l.wide ? 0.76 : 0.61),
          top: l.h * (l.wide ? 0.33 : l.compact ? 0.59 : 0.59),
          transform: `translateY(${(1 - p) * 35}px) rotate(${(1 - p) * -7}deg)`,
        }}
      >
        <Mark size={l.w * (l.wide ? 0.13 : 0.23)} metal />
      </div>
      <Caption
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.72 : 0.78),
          maxWidth: l.w * 0.7,
        }}
      >
        Votre site livré.
        <br />
        Les modalités sont précisées au devis.
      </Caption>
    </SceneFrame>
  );
};
export const Closing: React.FC<SceneProps> = ({ duration }) => {
  const l = useLayout(),
    f = (useCurrentFrame() * 135) / duration,
    p = easeOut(interpolate(f, [12, 40], [0, 1], clamp));
  const buttonW = l.w * (l.wide ? 0.29 : 0.85),
    buttonX = l.pad,
    buttonY = l.h * (l.wide ? 0.66 : l.compact ? 0.64 : 0.61);
  return (
    <SceneFrame footer={false}>
      <Wordmark
        size={l.wide ? 34 : l.w * 0.037}
        style={{ position: "absolute", left: l.pad, top: l.h * 0.13 }}
      />
      <Title
        size={l.wide ? l.w * 0.09 : l.w * 0.14}
        style={{
          position: "absolute",
          left: l.pad,
          top: l.h * (l.wide ? 0.3 : 0.3),
        }}
      >
        Voyez
        <br />
        le vôtre.
      </Title>
      <div
        style={{
          position: "absolute",
          left: buttonX,
          top: buttonY,
          width: buttonW,
          height: l.wide ? 78 : 110,
          borderRadius: 100,
          border: "1px solid rgba(243,241,235,.5)",
          background: f >= 84 ? brand.ivory : "transparent",
          color: f >= 84 ? brand.black : brand.ivory,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: l.wide ? 30 : 40,
          fontSize: l.wide ? 25 : 34,
          fontWeight: 500,
          transform: `translateY(${(1 - p) * 20}px)`,
          opacity: p,
        }}
      >
        <span>Essayer mon futur site</span>
        <svg
          width="26"
          height="26"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 16 16 4M5 4h11v11" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: l.pad,
          top: buttonY + (l.wide ? 108 : 160),
          fontSize: l.wide ? 36 : 53,
          fontWeight: 500,
          letterSpacing: "-.025em",
        }}
      >
        azelstudio.fr
      </div>
      <Caption style={{ position: "absolute", left: l.pad, top: l.h * 0.86 }}>
        Aperçu gratuit et sans engagement.
      </Caption>
      {f > 58 && (
        <Cursor
          x={buttonX + buttonW * 0.81}
          y={buttonY + (l.wide ? 48 : 70)}
          click={f > 84 && f < 98 ? (f - 84) / 14 : 0}
        />
      )}
    </SceneFrame>
  );
};
