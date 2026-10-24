import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Send, X } from 'lucide-react'
import { foundingSpots, packs, site } from '../content'
import { copyText, emailLink } from '../contact'

type Props = { open: boolean; pack: string; onClose: () => void }
type Status = 'idle' | 'sending' | 'sent' | 'opened' | 'error'

const NOT_SURE = 'Not sure yet'

function packLabel(name: string) {
  const p = packs.find((x) => x.name === name)
  if (!p) return NOT_SURE
  const founding = foundingSpots > 0 && p.founding
  return founding ? `${p.name} (founding rate ${p.founding!.price})` : `${p.name} (${p.price})`
}

export default function ContactDialog({ open, pack, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [selected, setSelected] = useState(pack || NOT_SURE)
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState({ subject: 'UGC enquiry', body: '' })

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setStatus('idle')
      setSelected(pack || NOT_SURE)
      d.showModal()
      document.body.style.overflow = 'hidden'
    }
    if (!open && d.open) d.close()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, pack])

  const buildMessage = (f: FormData) => {
    const name = String(f.get('name') || '')
    const email = String(f.get('email') || '')
    const product = String(f.get('product') || '')
    const message = String(f.get('message') || '')
    const chosen = String(f.get('pack') || NOT_SURE)
    const label = chosen === NOT_SURE ? NOT_SURE : packLabel(chosen)
    const subject = `UGC enquiry: ${label}`
    const body = [
      'Hi Adrian,',
      '',
      message,
      '',
      `Product / link: ${product || 'not shared yet'}`,
      `Package: ${label}`,
      '',
      name,
      email,
    ].join('\n')
    return { name, email, subject, body }
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('website')) return // câmp-capcană pentru boți
    const { name, email, subject, body } = buildMessage(data)
    setDraft({ subject, body })

    if (!site.formKey) {
      window.open(emailLink(subject, body), '_blank', 'noopener')
      setStatus('opened')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: site.formKey, subject, from_name: name, name, email, message: body }),
      })
      const json = await res.json()
      setStatus(json.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const copy = async () => {
    if (await copyText(site.email)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  const direct = emailLink(draft.subject, draft.body)

  return (
    <dialog
      ref={ref}
      className="contact-dialog"
      aria-labelledby="contact-title"
      onClose={() => {
        document.body.style.overflow = ''
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div className="contact-body">
        <button type="button" className="contact-close" onClick={() => ref.current?.close()} aria-label="Close">
          <X size={18} />
        </button>

        {status === 'sent' ? (
          <div className="contact-done">
            <span className="contact-check"><Check size={22} /></span>
            <h2 id="contact-title">Message sent.</h2>
            <p>Thanks. I’ll reply to the email you left, with a couple of ideas for your product.</p>
            <button type="button" className="btn btn-primary" onClick={() => ref.current?.close()}>Close</button>
          </div>
        ) : status === 'opened' ? (
          <div className="contact-done">
            <span className="contact-check"><Check size={22} /></span>
            <h2 id="contact-title">Your email is ready.</h2>
            <p>I opened your email app with the message already written. Press send there and it reaches me.</p>
            <div className="contact-row">
              <a className="btn btn-primary" href={direct} target="_blank" rel="noreferrer">Open it again</a>
              <button type="button" className="btn-text" onClick={copy}>{copied ? 'Copied' : `Copy ${site.email}`}</button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="contact-title">{pack ? `Ask about ${pack}` : 'Tell me about your product'}</h2>
            <p className="contact-lead">No brief needed. Tell me what you’re making and I’ll come back with ideas.</p>
            <form onSubmit={submit} className="contact-form">
              <div className="field-row">
                <label>
                  Your name
                  <input name="name" required autoComplete="name" placeholder="Jane Smith" />
                </label>
                <label>
                  Your email
                  <input name="email" type="email" required autoComplete="email" placeholder="jane@company.com" />
                </label>
              </div>
              <label>
                Product or link <span className="optional">optional</span>
                <input name="product" placeholder="Link to the app, site or product" />
              </label>
              <label>
                Package
                <select name="pack" value={selected} onChange={(e) => setSelected(e.target.value)}>
                  {packs.map((p) => (
                    <option key={p.name} value={p.name}>{packLabel(p.name)}</option>
                  ))}
                  <option value={NOT_SURE}>{NOT_SURE}</option>
                </select>
              </label>
              <label>
                What do you need?
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Who is it for, what should people do after watching, and when do you need it?"
                />
              </label>
              <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden />

              {status === 'error' && (
                <p className="contact-error" role="alert">
                  That didn’t go through. Use the email buttons below, or try again.
                </p>
              )}
              <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'sending'}>
                <Send size={16} /> {status === 'sending' ? 'Sending…' : site.formKey ? 'Send message' : 'Open in my email'}
              </button>
              {!site.formKey && (
                <p className="fine contact-note">This opens your email app with the message written, ready to send.</p>
              )}
            </form>

            <div className="contact-alt">
              <span>Prefer to write yourself?</span>
              <a className="btn-text" href={emailLink('UGC enquiry')} target="_blank" rel="noreferrer">Open in Gmail</a>
              <button type="button" className="btn-text" onClick={copy}>
                <Copy size={14} /> {copied ? 'Copied' : site.email}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
