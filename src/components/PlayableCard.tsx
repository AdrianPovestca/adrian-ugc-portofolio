import { useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'

export type CardItem = {
  id: string
  title: string
  note: string
  poster: string
  /** mp4 din /public/reels. Fără el, cardul rămâne doar poster (nu duce nicăieri). */
  video?: string
  /** link opțional, afișat discret sub card. Nu se deschide la play. */
  instagram?: string
  kind?: string
  views?: string
}

type Props = {
  item: CardItem
  active: boolean
  onToggle: () => void
  /** apelat când videoul se termină; returnează id-ul următorului video (sau null) */
  onEnded?: () => string | null
  muted: boolean
  onToggleSound: () => void
  className?: string
}

export default function PlayableCard({ item, active, onToggle, onEnded, muted, onToggleSound, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const playable = !!item.video && !failed

  const poster = (
    <>
      <img src={item.poster} alt="" loading="lazy" draggable={false} />
      {item.views && <span className="reel-views">{item.views} views</span>}
    </>
  )

  return (
    <article className={`reel ${className}`} data-active={active} data-id={item.id}>
      <div className="reel-frame">
        {playable ? (
          <>
            <button
              type="button"
              className="reel-hit"
              onClick={onToggle}
              aria-label={active ? `Pause ${item.title}` : `Play ${item.title}`}
            >
              {poster}
              {active && (
                <video
                  ref={(v) => {
                    // iOS/Safari cer atributul „muted” în HTML ca să accepte pornirea automată
                    if (v && muted) {
                      v.defaultMuted = true
                      v.muted = true
                    }
                  }}
                  src={item.video}
                  poster={item.poster}
                  autoPlay
                  playsInline
                  muted={muted}
                  preload="auto"
                  onEnded={(e) => {
                    const next = onEnded?.()
                    // un singur video în listă: îl pornește de la capăt
                    if (next === item.id) {
                      e.currentTarget.currentTime = 0
                      void e.currentTarget.play()
                    }
                  }}
                  onError={() => {
                    console.error(
                      `[video] Nu pot încărca ${item.video}. Fișierul e în public/reels cu exact acest nume? Rulează: npm run check:videos`,
                    )
                    setFailed(true)
                    if (active) onToggle()
                  }}
                />
              )}
              {!active && (
                <span className="reel-play" aria-hidden>
                  <Play size={20} fill="currentColor" />
                </span>
              )}
            </button>
            {active && (
              <button
                type="button"
                className="reel-sound"
                onClick={onToggleSound}
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
          </>
        ) : (
          <div className="reel-hit reel-static">
            {poster}
            {failed && <span className="reel-failed">Video unavailable</span>}
          </div>
        )}
      </div>
      <div className="reel-meta">
        {item.kind && <span className="reel-kind">{item.kind}</span>}
        <h3>{item.title}</h3>
        <p>{item.note}</p>
        {item.instagram && (
          <a className="reel-source" href={item.instagram} target="_blank" rel="noreferrer">
            Original on Instagram
          </a>
        )}
      </div>
    </article>
  )
}
