// Găsește ffmpeg: întâi cel instalat în sistem, apoi cel din proiect (pachetul npm `ffmpeg-static`).
// Așa nu ai nevoie de Homebrew: `npm install` aduce singur un ffmpeg.
import { spawnSync } from 'node:child_process'

export async function findFfmpeg() {
  if (!process.env.USE_STATIC_FFMPEG && !spawnSync('ffmpeg', ['-version']).error) return 'ffmpeg'
  try {
    const mod = await import('ffmpeg-static')
    const p = mod.default
    if (p && !spawnSync(p, ['-version']).error) return p
  } catch {
    /* pachetul nu e instalat */
  }
  return null
}

export const NO_FFMPEG_HELP = [
  'Nu găsesc ffmpeg. Rezolvarea fără Homebrew:',
  '  1) npm install',
  '  2) dacă tot nu merge:  node node_modules/ffmpeg-static/install.js',
  'Apoi rulează comanda din nou.',
].join('\n')
