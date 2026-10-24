// Pune toate videourile odată: convertește, le dă numele corect, le activează în src/content.ts și verifică.
// Folosire:  npm run videos -- ~/Desktop/videouri
//
// În folderul acela fiecare fișier trebuie să aibă numele reel-ului (extensia nu contează: .mov, .mp4 ...):
//   error-line-180   what-my-mom-thinks   staring-at-code
//   artisan-rituals  artisan-morning-dial-in  artisan-bomber-unboxing  artisan-oatly
// (majuscule, spații și _ nu contează: "Error Line 180.mov" merge)
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { findFfmpeg, NO_FFMPEG_HELP } from './ffmpeg-path.mjs'

const folder = process.argv[2]
if (!folder || !existsSync(folder)) {
  console.log('Folosire: npm run videos -- calea/spre/folderul-cu-videouri')
  process.exit(1)
}

const contentPath = 'src/content.ts'
let src = readFileSync(contentPath, 'utf8')
const ids = [...src.matchAll(/^\s*(?:\/\/\s*)?video:\s*'\/reels\/([^']+)\.mp4'/gm)].map((m) => m[1])
const norm = (s) => s.toLowerCase().replace(/[\s_]+/g, '-')

const exts = new Set(['.mp4', '.mov', '.m4v', '.mkv', '.webm', '.avi'])
const files = readdirSync(folder).filter((f) => exts.has(path.extname(f).toLowerCase()))
const FFMPEG = await findFfmpeg()
const hasFfmpeg = !!FFMPEG

if (!hasFfmpeg) console.log('\n' + NO_FFMPEG_HELP + '\n')
mkdirSync('public/reels', { recursive: true })

function encode(input, out, crf) {
  return spawnSync(
    FFMPEG,
    [
      '-hide_banner', '-loglevel', 'error', '-stats', '-y', '-i', input,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
      '-c:v', 'libx264', '-profile:v', 'high', '-crf', String(crf), '-preset', 'slow',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out,
    ],
    { stdio: 'inherit' },
  )
}

const done = []
const unmatched = []
for (const f of files) {
  const base = norm(path.basename(f, path.extname(f)))
  const id = ids.find((i) => i === base)
  if (!id) {
    unmatched.push(f)
    continue
  }
  const input = path.join(folder, f)
  const out = `public/reels/${id}.mp4`
  console.log(`\n▶ ${f}  →  ${out}`)
  if (!hasFfmpeg) {
    if (path.extname(f).toLowerCase() === '.mp4') {
      copyFileSync(input, out)
      console.log('  (fără ffmpeg: am copiat fișierul așa cum e. Rulează `npm install` și repetă comanda ca să fie verificat/convertit)')
    } else {
      console.log('  ❌ fără ffmpeg nu pot converti un fișier care nu e .mp4')
      continue
    }
  } else {
    let crf = 22
    let r = encode(input, out, crf)
    if (r.status !== 0) {
      console.log('  ❌ conversia a eșuat')
      continue
    }
    let mb = statSync(out).size / 1024 / 1024
    while (mb > 24 && crf < 32) {
      crf += 3
      console.log(`  prea mare (${mb.toFixed(1)} MB), comprim mai tare (crf ${crf})`)
      r = encode(input, out, crf)
      mb = statSync(out).size / 1024 / 1024
    }
  }
  const re = new RegExp(`^(\\s*)//\\s*(video:\\s*'/reels/${id}\\.mp4')`, 'm')
  src = src.replace(re, '$1$2')
  done.push(id)
}
writeFileSync(contentPath, src)

console.log('\n──────── Rezumat ────────')
console.log(done.length ? `Activate (${done.length}): ${done.join(', ')}` : 'Nu am activat niciun video.')
if (unmatched.length) {
  console.log('\nFișiere pe care nu le-am recunoscut (redenumește-le exact ca reel-urile):')
  unmatched.forEach((f) => console.log(`  ? ${f}`))
}
const missing = ids.filter((i) => !existsSync(`public/reels/${i}.mp4`))
if (missing.length) console.log(`\nÎncă lipsesc: ${missing.join(', ')}`)
console.log('\nVerific acum fișierele...')
spawnSync('node', ['scripts/check-videos.mjs'], { stdio: 'inherit' })
