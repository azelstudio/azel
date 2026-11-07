import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const browserExecutable = process.env.CHROME_PATH || undefined;
const serveUrl = await bundle({ entryPoint: "src/index.tsx" });
const id = process.argv[2] || "AzelFilmVertical";
const scale = Number(process.argv[3] || 0.5);
const suffix = scale === 1 ? "master" : "preview";
const composition = await selectComposition({
  serveUrl,
  id,
  browserExecutable,
});
let last = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  outputLocation: `renders/${id}-${suffix}.mp4`,
  scale,
  crf: scale === 1 ? 18 : 22,
  pixelFormat: "yuv420p",
  concurrency: 2,
  browserExecutable,
  onProgress: (p) => {
    const bucket = Math.floor(p.progress * 10);
    if (bucket !== last) {
      console.log(`Rendering ${id} ${bucket * 10}%`);
      last = bucket;
    }
  },
});
