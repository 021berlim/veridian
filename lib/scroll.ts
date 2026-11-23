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

function smoothScrollFallback(target: number) {
  const start = window.scrollY
  const distance = target - start
  const duration = SCROLL_DURATION * 1000
  let startTime: number | null = null

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = CAMERA_EASING(progress)

    window.scrollTo(0, start + distance * eased)

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
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
