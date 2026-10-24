import { useState } from 'react'
import { ArrowDown, Copy, Mail } from 'lucide-react'
import ContactDialog from './components/ContactDialog'
import CountUp from './components/CountUp'
import PlayableCard from './components/PlayableCard'
import ReelCarousel from './components/ReelCarousel'
import Reveal from './components/Reveal'
import { addons, brandWork, formats, foundingSpots, packs, reels, site, steps } from './content'
import { copyText, emailLink } from './contact'
import { useActiveSection, useScrolled } from './hooks'

const SECTION_IDS = ['top', 'reels', 'brand-work', 'formats', 'packages', 'process', 'about', 'contact']

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function App() {
  const [playing, setPlaying] = useState<string | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [ask, setAsk] = useState({ open: false, pack: '' })
  const [copied, setCopied] = useState(false)
  const openAsk = (pack = '') => setAsk({ open: true, pack })
  const copyEmail = async () => {
    if (await copyText(site.email)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  // La finalul unui video pornește următorul din aceeași secțiune; după ultimul, o ia de la început.
  const advance = (id: string): string | null => {
    const lists = [reels, brandWork.videos].map((l) => l.filter((i) => i.video))
    const list = lists.find((l) => l.some((i) => i.id === id))
    if (!list) {
      setPlaying(null)
      return null
    }
    const next = list[(list.findIndex((i) => i.id === id) + 1) % list.length]
    setPlaying(next.id)
    return next.id
  }
  const scrolled = useScrolled()
  const active = useActiveSection(SECTION_IDS)
  const founding = foundingSpots > 0
  const hero = reels[0]
  const second = reels[1]

  return (
    <main>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="nav wrap">
          <a className="wordmark" href="#top">
            adrian<span>.</span>script
          </a>
          <nav aria-label="Main">
            <a href="#reels" aria-current={active === 'reels' ? 'true' : undefined}>Reels</a>
            <a href="#brand-work" aria-current={active === 'brand-work' ? 'true' : undefined}>Brand work</a>
            <a href="#packages" aria-current={active === 'packages' ? 'true' : undefined}>Packages</a>
            <a href="#process" aria-current={active === 'process' ? 'true' : undefined}>How it works</a>
            <a className="nav-cta" href="#contact">Work with me</a>
          </nav>
        </div>
      </header>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="hero-line">
            <span className="hero-err">error</span> line 180: you’ve been here too.
          </p>
          <h1>Videos people send with “same.”</h1>
          <p className="hero-text">
            I’m Adrian. I make short, cinematic videos for apps, AI tools and gadgets: a hook that stops the scroll,
            a moment everyone recognises, and your product right in the middle of it.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#reels">
              Watch the reels <ArrowDown size={16} />
            </a>
            <a className="btn-text" href="#packages">See packages</a>
          </div>
          <dl className="hero-proof">
            <div>
              <dt><CountUp value={hero.views} delay={900} /></dt>
              <dd>views on “{hero.title}”</dd>
            </div>
            <div>
              <dt><CountUp value={second.views} delay={1050} /></dt>
              <dd>views on “{second.title}”</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual">
          <div className="phone">
            {site.heroMedia === 'video' && hero.video ? (
              <video
                ref={(v) => {
                  if (v) {
                    v.defaultMuted = true
                    v.muted = true
                  }
                }}
                src={hero.video}
                poster={site.heroPhoto}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={site.heroPhoto} alt="Adrian, the creator behind adrian.script" />
            )}
          </div>
          <div className="hero-chip">
            <strong>{hero.views}</strong> views on one reel
          </div>
        </div>
      </section>

      <section className="section" id="reels">
        <div className="wrap">
          <Reveal className="section-head">
            <h2>Reels</h2>
            <p>Things I’ve made. Tap one to watch it right here.</p>
          </Reveal>
          <Reveal delay={120}>
            <ReelCarousel
              playing={playing}
              onPlay={setPlaying}
              onEnded={advance}
              muted={!soundOn}
              onToggleSound={() => setSoundOn((s) => !s)}
            />
          </Reveal>
          <Reveal as="p" className="fine" delay={200}>
            View counts are from my Instagram, as of October 2026. They keep moving.{' '}
            <a href={site.instagram} target="_blank" rel="noreferrer">All of them are on my profile.</a>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="brand-work">
        <div className="wrap">
          <Reveal className="section-head">
            <h2>Made with {brandWork.client}</h2>
            <p>
              {brandWork.text}{' '}
              <a href={brandWork.clientLink} target="_blank" rel="noreferrer">Artisan on Instagram</a>
            </p>
          </Reveal>
          <ul className="brand-grid">
            {brandWork.videos.map((v, i) => (
              <Reveal as="li" delay={i * 110} key={v.id}>
                <PlayableCard
                  item={v}
                  active={playing === v.id}
                  onToggle={() => setPlaying((p) => (p === v.id ? null : v.id))}
                  onEnded={() => advance(v.id)}
                  muted={!soundOn}
                  onToggleSound={() => setSoundOn((s) => !s)}
                />
              </Reveal>
            ))}
          </ul>
          <Reveal className="featuring">
            <span>{brandWork.featuringLabel}</span>
            <ul>
              {brandWork.featuring.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" id="formats">
        <div className="wrap split">
          <Reveal className="split-intro">
            <h2>What I can make for you</h2>
            <p>
              I film the moment people already live through and put your product inside it. It never feels like an ad,
              and that’s the reason people watch to the end.
            </p>
          </Reveal>
          <ul className="format-list">
            {formats.map((f, i) => (
              <Reveal as="li" delay={i * 90} key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" id="packages">
        <div className="wrap">
          <Reveal className="section-head">
            <h2>Packages</h2>
            <p>Prices in USD. Not sure which one fits? Tell me about the product and I’ll point you to one.</p>
          </Reveal>
          <div className="packs">
            {packs.map((base, i) => {
              const discounted = founding && !!base.founding
              const p = discounted ? { ...base, ...base.founding } : base
              return (
                <Reveal as="article" className="pack" delay={i * 130} data-featured={p.featured ? 'true' : undefined} key={p.name}>
                  {p.featured && <span className="pack-flag">Best value</span>}
                  <h3>{p.name}</h3>
                  <p className="pack-tag">{p.bestFor}</p>
                  <p className="pack-price">
                    {discounted && <s aria-label={`Regular price ${base.price}`}>{base.price}</s>}
                    <strong>{p.price}</strong> <span>{p.unit}</span>
                  </p>
                  {discounted && (
                    <p className="pack-founding">
                      Founding client rate, {foundingSpots} {foundingSpots === 1 ? 'spot' : 'spots'} left
                    </p>
                  )}
                  <p className="pack-per">
                    {p.perVideo}
                    {p.saving && <em>{p.saving}</em>}
                  </p>
                  {p.note && <p className="pack-note">{p.note}</p>}
                  <ul>
                    {p.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-primary" onClick={() => openAsk(p.name)}>
                    Ask about this
                  </button>
                </Reveal>
              )
            })}
          </div>

          {founding && (
            <Reveal as="p" className="fine founding-note">
              I’m taking my first {foundingSpots} projects at a lower price. In return I ask for a short testimonial
              and permission to show the work here.
            </Reveal>
          )}

          <Reveal className="addons">
            <h3>Add-ons</h3>
            <dl>
              {addons.map((a) => (
                <div key={a.name}>
                  <dt>{a.name}</dt>
                  <dd>{a.price}</dd>
                </div>
              ))}
            </dl>
            <p className="fine">
              Every package covers organic posting on your own channels. Running the video as an ad is a separate
              license, so you only pay for what you use.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" id="process">
        <div className="wrap split">
          <Reveal className="split-intro">
            <h2>How it works</h2>
            <p>Five steps, and you see the idea before I film anything.</p>
          </Reveal>
          <ol className="steps">
            {steps.map((st, i) => (
              <Reveal as="li" delay={i * 110} key={st.title}>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="wrap about-inner">
          <Reveal as="h2">Hi, I’m Adrian.</Reveal>
          <Reveal delay={140}>
            <p>
              I build things myself, so when I demo your tool I actually understand what it’s doing. Then I turn that
              into the kind of video I’d stop scrolling for: honest, a bit funny, and about a problem someone really has.
            </p>
            <p>
              I make content that says “this is me” and “I have this exact problem.” The product earns its place in
              the story instead of interrupting it.
            </p>
            <a className="btn-text" href={site.instagram} target="_blank" rel="noreferrer">
              <InstagramIcon /> Follow along on Instagram
            </a>
          </Reveal>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <Reveal as="h2">Got a product that deserves a better video than an ad?</Reveal>
          <Reveal as="p" delay={120}>Send me the link and a sentence about who it’s for. I’ll reply with a couple of ideas.</Reveal>
          <Reveal delay={240} className="contact-actions">
            <button type="button" className="btn btn-primary btn-big" onClick={() => openAsk()}>
              <Mail size={18} /> Send me a message
            </button>
            <a className="btn btn-ghost btn-big" href={emailLink('UGC enquiry')} target="_blank" rel="noreferrer">
              Open in Gmail
            </a>
          </Reveal>
          <Reveal as="p" className="contact-mail" delay={320}>
            Or write to <strong>{site.email}</strong>{' '}
            <button type="button" className="copy-btn" onClick={copyEmail}>
              <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </Reveal>
        </div>
      </section>

      <ContactDialog open={ask.open} pack={ask.pack} onClose={() => setAsk((s) => ({ ...s, open: false }))} />

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="wordmark" href="#top">
            adrian<span>.</span>script
          </a>
          <span>© {new Date().getFullYear()} {site.fullName}</span>
        </div>
      </footer>
    </main>
  )
}

export default App
