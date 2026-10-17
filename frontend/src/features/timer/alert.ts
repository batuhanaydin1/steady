/**
 * End-of-session alerts: a four-note chime generated with the Web Audio
 * API (no audio files or libraries) and an optional OS notification.
 */

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

/**
 * Browsers block audio until the user interacts with the page.
 * Call this from a click handler (e.g. the Start button).
 */
export function unlockAudio(): void {
  const context = getAudioContext()
  if (context && context.state === 'suspended') {
    void context.resume()
  }
}

/**
 * Plays a soft four-note bell to signal the end of a session.
 *
 * Each note is left ringing while the next one starts, and the whole figure is
 * rung twice in a row, so the chime carries for about five seconds instead of
 * passing in a blink.
 */
export function playChime(): void {
  const context = getAudioContext()
  if (!context) return
  if (context.state === 'suspended') {
    void context.resume()
  }

  const notes = [880, 1174.66, 1479.98, 1760] // A5, D6, F#6, A6
  const spacing = 0.32
  const ring = 1.5
  const length = (notes.length - 1) * spacing + ring + 0.05
  const gap = 0.2
  const rings = 2
  const start = context.currentTime

  for (let ringIndex = 0; ringIndex < rings; ringIndex += 1) {
    const ringStart = start + ringIndex * (length + gap)

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const noteStart = ringStart + index * spacing

      oscillator.type = 'sine'
      oscillator.frequency.value = frequency

      gain.gain.setValueAtTime(0, noteStart)
      gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + ring)

      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(noteStart)
      oscillator.stop(noteStart + ring + 0.05)
    })
  }
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

/**
 * Whether this browser has already been allowed to show notifications.
 *
 * Not the same as the saved preference: the preference is the user's intent,
 * which follows them between devices, while this permission belongs to one
 * browser and can only be granted here.
 */
export function notificationsGranted(): boolean {
  return notificationsSupported() && Notification.permission === 'granted'
}

/** Requests permission only when the user opts in. Returns whether it is granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false
  if (notificationsGranted()) return true
  if (Notification.permission === 'denied') return false
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

export function showNotification(title: string, body: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/favicon.svg', tag: 'steady-timer' })
  } catch {
    /* Some browsers require a service worker for notifications. Ignore. */
  }
}