// Verifică videourile din src/content.ts: există fișierul? Are numele corect? E sub 25 MB? E H.264?
// Rulează:  npm run check:videos
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const MAX_MB = 25
const src = readFileSync('src/content.ts', 'utf8')
const active = [...src.matchAll(/^\s*video:\s*'(\/reels\/[^']+)'/gm)].map((m) => m[1])
const waiting = [...src.matchAll(/^\s*\/\/\s*video:\s*'(\/reels\/[^']+)'/gm)].map((m) => m[1])

let problems = 0
const ok = (m) => console.log(`  ✅ ${m}`)
const bad = (m) => { problems++; console.log(`  ❌ ${m}`) }

function probe(file) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    ).trim()
    const [codec, w, h] = out.split(',')
    return { codec, w: +w, h: +h }
  } catch {
    return null
  }
}

console.log('\nVideouri active în content.ts:')
if (!active.length) console.log('  (niciunul încă, toate liniile `video:` au // în față)')
for (const url of active) {
  const file = 'public' + url
  if (!existsSync(file)) {
    bad(`${url}: LIPSEȘTE fișierul. Pune-l în public/reels/ cu exact acest nume.`)
    continue
  }
  const mb = statSync(file).size / 1024 / 1024
  if (mb > MAX_MB) bad(`${url}: ${mb.toFixed(1)} MB, peste limita Cloudflare de ${MAX_MB} MB. Comprimă-l (npm run convert).`)
  else ok(`${url}: ${mb.toFixed(1)} MB`)
  const info = probe(file)
  if (!info) console.log('     (ffprobe nu e instalat, nu pot verifica formatul. Opțional: brew install ffmpeg)')
  else if (info.codec !== 'h264') bad(`${url}: codec ${info.codec}. Browserele nu redau sigur asta. Rulează: npm run convert`)
  else if (info.w > info.h) bad(`${url}: e pe orizontală (${info.w}x${info.h}). Site-ul așteaptă video vertical 9:16.`)
  else ok(`${url}: H.264, ${info.w}x${info.h}`)
}

console.log('\nFișiere care așteaptă să fie activate (linia are //):')
let any = false
for (const url of waiting) {
  if (existsSync('public' + url)) {
    any = true
    console.log(`  ➜ ${url}: fișierul există, scoate // din content.ts ca să apară.`)
  }
}
if (!any) console.log('  (nimic)')

const used = new Set([...active, ...waiting].map((u) => u.replace('/reels/', '')))
const extra = existsSync('public/reels')
  ? readdirSync('public/reels').filter((f) => f.endsWith('.mp4') && !used.has(f))
  : []
if (extra.length) {
  console.log('\nFișiere mp4 în public/reels care nu sunt folosite nicăieri (nume greșit?):')
  extra.forEach((f) => console.log(`  ? ${f}`))
}

console.log(problems ? `\n${problems} problemă(e) de rezolvat.\n` : '\nTotul arată bine.\n')
process.exit(problems ? 1 : 0)
