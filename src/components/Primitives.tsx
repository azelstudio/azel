import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, clamp } from "../theme";
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
export const useLayout = () => {
  const { width: w, height: h } = useVideoConfig();
  const wide = w > h;
  return {
    w,
    h,
    wide,
    compact: !wide && h / w < 1.5,
    pad: w * 0.074,
    head: wide ? w * 0.065 : w * 0.112,
  };
};
export const Mark: React.FC<{
  size?: number;
  metal?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 100, metal = false, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={style}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="azel-metal" x1="0" x2="1" y1="0" y2="1">
        <stop stopColor="#fffdf7" />
        <stop offset=".31" stopColor="#b2b3b4" />
        <stop offset=".58" stopColor="#3d3e40" />
        <stop offset=".83" stopColor="#969696" />
        <stop offset="1" stopColor="#f3f1eb" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="36"
      width="60"
      height="60"
      rx="4"
      fill={metal ? "url(#azel-metal)" : brand.ivory}
    />
    <rect
      x="64"
      y="4"
      width="32"
      height="32"
      rx="3"
      fill={metal ? "url(#azel-metal)" : brand.ivory}
    />
  </svg>
);
export const Wordmark: React.FC<{
  size?: number;
  style?: React.CSSProperties;
}> = ({ size = 30, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.42,
      fontSize: size,
      color: brand.ivory,
      letterSpacing: "-.035em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <Mark size={size * 1.3} />
    <span>
      <b style={{ fontWeight: 700 }}>AZEL</b>
      <span style={{ fontWeight: 400 }}> STUDIO</span>
    </span>
  </div>
);
export const Browser: React.FC<{
  src: string;
  style?: React.CSSProperties;
  chrome?: boolean;
  children?: React.ReactNode;
}> = ({ src, style, chrome = true, children }) => (
  <div
    style={{
      borderRadius: 24,
      overflow: "hidden",
      background: "#151617",
      border: "1px solid rgba(243,241,235,.3)",
      boxShadow: "0 42px 100px -34px rgba(0,0,0,.9)",
      ...style,
    }}
  >
    {chrome && (
      <div
        style={{
          height: 30,
          display: "flex",
          gap: 6,
          alignItems: "center",
          paddingInline: 14,
          background: "#151617",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              background: "#747476",
            }}
          />
        ))}
      </div>
    )}
    <Img
      src={staticFile(src)}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
    {children}
  </div>
);
export const Cursor: React.FC<{
  x: number;
  y: number;
  click?: number;
  scale?: number;
}> = ({ x, y, click = 0, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      pointerEvents: "none",
      zIndex: 30,
    }}
  >
    {click > 0 && (
      <div
        style={{
          position: "absolute",
          width: 70,
          height: 70,
          left: -32,
          top: -32,
          borderRadius: "50%",
          border: `2px solid rgba(243,241,235,${1 - click})`,
          transform: `scale(${0.35 + click * 1.5})`,
        }}
      />
    )}
    <svg
      width="36"
      height="42"
      viewBox="0 0 32 40"
      fill={brand.ivory}
      stroke="#080808"
      strokeWidth="1.5"
    >
      <path d="M2 2v29l8-7 7 14 6-3-7-13 11-2z" />
    </svg>
  </div>
);
export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
  from?: number;
}> = ({ children, size, style, from = 0 }) => {
  const f = useCurrentFrame(),
    l = useLayout();
  const p = easeOut(interpolate(f, [from, from + 14], [0, 1], clamp));
  return (
    <div
      style={{
        fontSize: size || l.head,
        lineHeight: 0.97,
        fontWeight: 600,
        letterSpacing: "-.045em",
        color: brand.ivory,
        transform: `translateY(${(1 - p) * 28}px)`,
        opacity: from === 0 ? 1 : p,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  footer?: boolean;
}> = ({ children, footer = true }) => {
  const l = useLayout();
  return (
    <AbsoluteFill
      style={{
        background: brand.black,
        fontFamily: brand.font,
        color: brand.ivory,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 72% 48%,rgba(150,151,155,.075),transparent 57%)",
        }}
      />
      {children}
      {footer && (
        <Wordmark
          size={l.wide ? 27 : l.w * 0.028}
          style={{
            position: "absolute",
            left: l.pad,
            bottom: l.h * (l.wide ? 0.065 : 0.075),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
export const Caption: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const l = useLayout();
  return (
    <div
      style={{
        fontSize: l.wide ? 21 : l.w * 0.026,
        lineHeight: 1.45,
        color: brand.muted,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Sweep: React.FC<{ frame: number; duration?: number }> = ({
  frame,
  duration = 40,
}) => {
  const x = interpolate(frame, [0, duration], [-160, 160], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20% -50%",
          background:
            "linear-gradient(110deg,transparent 40%,rgba(255,255,255,.11) 49%,transparent 58%)",
          transform: `translateX(${x}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
