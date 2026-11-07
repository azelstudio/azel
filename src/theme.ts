export const brand = {
  black: "#080808",
  ivory: "#F3F1EB",
  muted: "#CFCDC6",
  line: "rgba(243,241,235,.16)",
  olive: "#8B9273",
  ink: "#8199A1",
  clay: "#C68D6E",
  plum: "#BA929A",
  font: "Instrument Sans",
  url: "azelstudio.fr",
};
export const scenes = [
  { key: "signature", title: "Votre futur site.", frames: 75, short: 45 },
  { key: "gallery", title: "Essayez-le.", frames: 90, short: 60 },
  { key: "name", title: "Votre nom.", frames: 120, short: 90 },
  { key: "color", title: "Vos couleurs.", frames: 105, short: 60 },
  { key: "responsive", title: "Sur tous les écrans.", frames: 105, short: 60 },
  { key: "ownership", title: "Il vous appartient.", frames: 90, short: 60 },
  { key: "cta", title: "Voyez le vôtre.", frames: 135, short: 75 },
] as const;
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
