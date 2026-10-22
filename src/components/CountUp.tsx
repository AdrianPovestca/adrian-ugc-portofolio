import { useEffect, useState } from 'react'

/** Numărul urcă de la 0 la valoare (ex: "462K"). Se oprește imediat dacă ai activat „reduce motion”. */
export default function CountUp({ value, delay = 0, duration = 1500 }: { value: string; delay?: number; duration?: number }) {
  const match = /^([\d.,]+)\s*([A-Za-z]*\+?)$/.exec(value)
  const calm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const target = match ? parseFloat(match[1].replace(/,/g, '')) : 0
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0
  const suffix = match ? match[2] : ''
  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  const [shown, setShown] = useState(match && !calm ? fmt(0) : value)

  useEffect(() => {
    if (!match || calm) return
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(t >= 1 ? value : fmt(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay, duration])

  return (
    <span aria-label={value}>
      <span aria-hidden>{shown}</span>
    </span>
  )
}
