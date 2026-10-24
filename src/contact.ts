import { site } from './content'

const enc = encodeURIComponent

export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

/** Compune în Gmail (desktop). */
export const gmailUrl = (subject: string, body = '') =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(site.email)}&su=${enc(subject)}${body ? `&body=${enc(body)}` : ''}`

/** Aplicația de email a telefonului. */
export const mailtoUrl = (subject: string, body = '') =>
  `mailto:${site.email}?subject=${enc(subject)}${body ? `&body=${enc(body)}` : ''}`

/** Gmail pe desktop, aplicația de mail pe telefon. */
export const emailLink = (subject: string, body = '') => (isMobile() ? mailtoUrl(subject, body) : gmailUrl(subject, body))

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
