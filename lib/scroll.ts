import type Lenis from "lenis"

export const HEADER_OFFSET = 96
export const PENDING_SCROLL_KEY = "zuse-scroll-target"

const CAMERA_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
const SCROLL_DURATION = 1.05

let lenisInstance: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function getLenis() {
  return lenisInstance
}

function ensureLenisRunning() {
  lenisInstance?.start()
}

function clearUrlHash() {
  if (typeof window !== "undefined" && window.location.hash) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    )
  }
}

function getHeaderHeight(): number {
  if (typeof window === "undefined") return HEADER_OFFSET
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h")
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HEADER_OFFSET
}

function smoothScrollFallback(
  target: number,
  durationSec = SCROLL_DURATION,
  easing: (t: number) => number = CAMERA_EASING,
) {
  const start = window.scrollY
  const distance = target - start
  const duration = durationSec * 1000
  let startTime: number | null = null

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easing(progress)

    window.scrollTo(0, start + distance * eased)

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function scrollToElementCenter(
  element: HTMLElement | null,
  options?: {
    duration?: number
    immediate?: boolean
    easing?: (t: number) => number
  },
) {
  if (!element || typeof window === "undefined") return

  ensureLenisRunning()
  lenisInstance?.resize()

  const headerH = getHeaderHeight()
  const rect = element.getBoundingClientRect()
  const elementCenterY = rect.top + window.scrollY + rect.height / 2
  const visibleCenterOffset = headerH + (window.innerHeight - headerH) / 2
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const targetY = Math.max(
    0,
    Math.min(maxScrollY, elementCenterY - visibleCenterOffset),
  )

  const immediate = options?.immediate ?? false
  const duration = immediate ? 0 : (options?.duration ?? 0.85)
  const easing = options?.easing ?? CAMERA_EASING

  if (lenisInstance) {
    lenisInstance.scrollTo(targetY, {
      immediate,
      duration,
      easing,
    })
    return
  }

  if (immediate) {
    window.scrollTo(0, targetY)
    return
  }

  smoothScrollFallback(targetY, duration, easing)
}

export function scrollToSection(targetId: string) {
  const cleanId = targetId.replace(/^#/, "")
  const element = document.getElementById(cleanId)

  if (!element) {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      try {
        sessionStorage.setItem(PENDING_SCROLL_KEY, cleanId)
      } catch {
        // ignora se storage indisponível
      }
      window.location.href = "/"
    }
    return
  }

  clearUrlHash()
  ensureLenisRunning()

  if (lenisInstance) {
    lenisInstance.scrollTo(element, {
      offset: -HEADER_OFFSET,
      duration: SCROLL_DURATION,
      easing: CAMERA_EASING,
    })
    return
  }

  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  smoothScrollFallback(top)
}

export function consumePendingScrollTarget(): void {
  if (typeof window === "undefined") return

  let targetId: string | null = null
  try {
    targetId = sessionStorage.getItem(PENDING_SCROLL_KEY)
    if (targetId) sessionStorage.removeItem(PENDING_SCROLL_KEY)
  } catch {
    // ignora
  }

  if (!targetId && window.location.hash.length > 1) {
    targetId = window.location.hash.slice(1)
    clearUrlHash()
  }

  if (targetId) {
    const id = targetId
    window.setTimeout(() => scrollToSection(id), 80)
  }
}

export function scrollToTop() {
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    window.location.href = "/"
    return
  }

  clearUrlHash()
  ensureLenisRunning()

  if (lenisInstance) {
    lenisInstance.scrollTo(0, {
      duration: SCROLL_DURATION,
      easing: CAMERA_EASING,
    })
    return
  }

  smoothScrollFallback(0)
}
