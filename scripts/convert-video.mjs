// Face dintr-un video oarecare un mp4 gata pentru site (H.264, 1080x1920, sub 25 MB, pornire rapidă).
// Folosire:  npm run convert -- ~/Desktop/clip.mov error-line-180
//            (al doilea argument = numele final, fără .mp4; apare în public/reels/)
import { spawnSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'

const [input, name] = process.argv.slice(2)
if (!input || !name) {
  console.log('Folosire: npm run convert -- calea/spre/video.mov nume-final')
  process.exit(1)
}
if (spawnSync('ffmpeg', ['-version']).error) {
  console.log('ffmpeg nu e instalat. Pe Mac: brew install ffmpeg')
  process.exit(1)
}
mkdirSync('public/reels', { recursive: true })
const out = `public/reels/${name}.mp4`

function encode(crf) {
  return spawnSync(
    'ffmpeg',
    [
      '-y', '-i', input,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
      '-c:v', 'libx264', '-profile:v', 'high', '-crf', String(crf), '-preset', 'slow',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out,
    ],
    { stdio: 'inherit' },
  )
}

let crf = 22
let r = encode(crf)
if (r.status !== 0) process.exit(r.status ?? 1)
let mb = statSync(out).size / 1024 / 1024
while (mb > 24 && crf < 32) {
  crf += 3
  console.log(`\nPrea mare (${mb.toFixed(1)} MB), încerc din nou cu mai multă compresie (crf ${crf})...\n`)
  r = encode(crf)
  if (r.status !== 0) process.exit(r.status ?? 1)
  mb = statSync(out).size / 1024 / 1024
}
console.log(`\nGata: ${out} (${mb.toFixed(1)} MB)`)
console.log("Acum scoate // din linia `video:` a acestui reel în src/content.ts, apoi rulează: npm run check:videos")
