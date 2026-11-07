import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
const url = await bundle({ entryPoint: "src/index.tsx" });
const browserExecutable = process.env.CHROME_PATH || undefined;
const c = await selectComposition({
  serveUrl: url,
  id: "AzelFilmVertical",
  browserExecutable,
});
await mkdir("renders/stills", { recursive: true });
for (const frame of [30, 120, 240, 330, 440, 540, 660]) {
  await renderStill({
    serveUrl: url,
    composition: c,
    frame,
    output: `renders/stills/frame-${String(frame).padStart(3, "0")}.png`,
    browserExecutable,
  });
}
