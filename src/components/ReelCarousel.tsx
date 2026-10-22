import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { reels } from '../content'
import PlayableCard from './PlayableCard'

type Props = {
  playing: string | null
  onPlay: (id: string | null) => void
  onEnded: (id: string) => string | null
  muted: boolean
  onToggleSound: () => void
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export default function ReelCarousel({ playing, onPlay, onEnded, muted, onToggleSound }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)
  const drag = useRef({ on: false, x: 0, left: 0, moved: false })
  const [index, setIndex] = useState(0)
  const started = useRef(false)
  const playingRef = useRef(playing)
  const onPlayRef = useRef(onPlay)
  playingRef.current = playing
  onPlayRef.current = onPlay
  const [edge, setEdge] = useState({ start: true, end: false })

  const stepSize = () => {
    const el = scroller.current
    const first = el?.querySelector<HTMLElement>('.reel')
    if (!el || !first) return 0
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
  }

  // Pune pe fiecare card două valori (--p poziția, --e cât iese din margine) pe care le folosește CSS-ul.
  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const box = el.getBoundingClientRect()
    const center = box.left + box.width / 2
    el.querySelectorAll<HTMLElement>('.reel').forEach((card) => {
      const r = card.getBoundingClientRect()
      const p = clamp((r.left + r.width / 2 - center) / (box.width / 2), -1, 1)
      const out = Math.max(clamp((box.left - r.left) / r.width, 0, 1), clamp((r.right - box.right) / r.width, 0, 1))
      card.style.setProperty('--p', p.toFixed(3))
      card.style.setProperty('--e', out.toFixed(3))
    })
    const max = el.scrollWidth - el.clientWidth
    const scrollable = max > 2
    if (root.current) root.current.dataset.scrollable = String(scrollable)
    if (bar.current) bar.current.style.transform = `scaleX(${scrollable ? el.scrollLeft / max : 0})`
    const step = stepSize()
    if (step) setIndex(clamp(Math.round(el.scrollLeft / step), 0, reels.length - 1))
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
  }, [])

  const schedule = useCallback(() => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(update)
  }, [update])

  useEffect(() => {
    update()
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf.current)
    }
  }, [update, schedule])

  // Pornește singur primul video când caruselul e vizibil; îl oprește când pleci din secțiune.
  useEffect(() => {
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const first = reels.find((r) => r.video)
    if (!first) return
    const ids = reels.map((r) => r.id)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.55 && !started.current && playingRef.current === null) {
          started.current = true
          onPlayRef.current(first.id)
        } else if (entry.intersectionRatio < 0.1 && playingRef.current && ids.includes(playingRef.current)) {
          onPlayRef.current(null)
        }
      },
      { threshold: [0, 0.1, 0.55] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Când trece la următorul video, caruselul îl aduce în față.
  useEffect(() => {
    const el = scroller.current
    if (!el || !playing) return
    const card = el.querySelector<HTMLElement>(`[data-id="${playing}"]`)
    if (!card) return
    const box = el.getBoundingClientRect()
    const r = card.getBoundingClientRect()
    if (r.left < box.left - 1 || r.right > box.right + 1) {
      el.scrollTo({ left: el.scrollLeft + (r.left - box.left), behavior: 'smooth' })
    }
  }, [playing])

  const go = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * stepSize(), behavior: 'smooth' })

  // Tragere cu mouse-ul (pe telefon merge swipe-ul normal)
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scroller.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false }
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scroller.current
    const d = drag.current
    if (!el || !d.on) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      el.classList.add('dragging')
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scroller.current
    if (!el || !drag.current.on) return
    drag.current.on = false
    el.classList.remove('dragging')
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
  }
  // După o tragere, nu lăsa click-ul să pornească un video din greșeală
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div className="carousel" ref={root} data-scrollable="false" role="region" aria-roledescription="carousel" aria-label="Reels">
      <div className="carousel-bar">
        <span className="carousel-count" aria-live="polite">
          {String(index + 1).padStart(2, '0')} of {String(reels.length).padStart(2, '0')}
        </span>
        <div className="carousel-buttons">
          <button type="button" onClick={() => go(-1)} aria-label="Previous reel" disabled={edge.start}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next reel" disabled={edge.end}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        className="carousel-track"
        ref={scroller}
        onScroll={schedule}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        tabIndex={0}
      >
        {reels.map((reel) => (
          <PlayableCard
            key={reel.id}
            item={reel}
            active={playing === reel.id}
            onToggle={() => onPlay(playing === reel.id ? null : reel.id)}
            onEnded={() => onEnded(reel.id)}
            muted={muted}
            onToggleSound={onToggleSound}
          />
        ))}
      </div>
      <div className="carousel-progress" aria-hidden>
        <span ref={bar} />
      </div>
    </div>
  )
}
