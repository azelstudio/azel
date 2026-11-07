import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
const serveUrl = await bundle({ entryPoint: "src/index.tsx" });
const browserExecutable = process.env.CHROME_PATH || undefined;
await mkdir("renders/format-checks", { recursive: true });
for (const id of ["AzelFilmFeed", "AzelFilmWide", "AzelShortVertical"]) {
  const composition = await selectComposition({
    serveUrl,
    id,
    browserExecutable,
  });
  const frames =
    id === "AzelShortVertical"
      ? [20, 130, 220, 290, 350, 420]
      : [120, 240, 330, 440, 660];
  for (const frame of frames) {
    await renderStill({
      serveUrl,
      composition,
      frame,
      browserExecutable,
      imageFormat: "jpeg",
      jpegQuality: 90,
      output: `renders/format-checks/${id}-${frame}.jpg`,
    });
  }
  console.log(`${id} checked`);
}
