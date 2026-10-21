import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** întârziere în ms, pentru efectul de „în cascadă” */
  delay?: number
  [key: `data-${string}`]: string | undefined
}

/** Apare ușor (fade + urcă puțin) când intră în ecran, o singură dată. */
export default function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }: Props) {
  const Tag = as as ElementType
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm || !('IntersectionObserver' in window)) {
      el.dataset.in = 'true'
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.in = 'true'
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ ...style, '--d': `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  )
}
