import { useEffect, useState } from 'react'
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
  className?: string
}

export default function PlayableCard({ item, active, onToggle, className = '' }: Props) {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!active) setMuted(true)
  }, [active])

  const poster = (
    <>
      <img src={item.poster} alt="" loading="lazy" draggable={false} />
      {item.views && <span className="reel-views">{item.views} views</span>}
    </>
  )

  return (
    <article className={`reel ${className}`} data-active={active}>
      <div className="reel-frame">
        {item.video ? (
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
                  src={item.video}
                  poster={item.poster}
                  autoPlay
                  loop
                  playsInline
                  muted={muted}
                  preload="metadata"
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
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
          </>
        ) : (
          <div className="reel-hit reel-static">{poster}</div>
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
