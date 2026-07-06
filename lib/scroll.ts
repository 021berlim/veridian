import type Lenis from "lenis"

export const HEADER_OFFSET = 96

const CAMERA_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
const SCROLL_DURATION = 1.05

let lenisInstance: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance
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
  const element = document.getElementById(targetId.replace("#", ""))
  if (!element) return

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

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, {
      duration: SCROLL_DURATION,
      easing: CAMERA_EASING,
    })
    return
  }

  smoothScrollFallback(0)
}