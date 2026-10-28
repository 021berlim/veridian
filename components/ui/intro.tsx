"use client"

import { useEffect, useRef, useState } from "react"
import { ZuseMonogram, ZuseLogotype } from "@/components/ui/zuse-logo"
import { gsap, INTRO } from "@/lib/motion"
import { getLenis } from "@/lib/scroll"

export function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)
  const monoWrapperRef = useRef<HTMLDivElement>(null)
  const typoWrapperRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const hasHash = window.location.hash.length > 1

    // Se usuário prefere movimento reduzido ou veio com âncora direta, pula intro
    if (prefersReduced || hasHash) {
      document.documentElement.dataset.introState = "done"
      document.documentElement.setAttribute("data-preloader-done", "true")
      window.dispatchEvent(new Event("intro-complete"))
      setActive(false)
      return
    }

    // Travar scroll e marcar estado inicial
    document.documentElement.dataset.introState = "playing"
    document.documentElement.setAttribute("data-preloader-done", "false")
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    const lenis = getLenis()
    lenis?.stop()

    const overlay = overlayRef.current
    const comp = compositionRef.current
    const mono = monoWrapperRef.current
    const typo = typoWrapperRef.current

    if (!overlay || !comp || !mono || !typo) return

    const ctx = gsap.context(() => {
      // Estado Inicial
      gsap.set(overlay, { opacity: 1 })
      gsap.set(mono, { scale: 0.94, opacity: 1, transformOrigin: "center center" })

      // Mede proporções para centralizar o Z perfeitamente no frame inicial
      const monoW = mono.offsetWidth || 180
      const typoW = typo.offsetWidth || 280
      const gap = 20
      // Deslocamento para que o Z fique exatamente no centro da viewport
      const centerOffsetX = (monoW + gap + typoW) / 2 - monoW / 2

      gsap.set(comp, { x: centerOffsetX, y: 0, scale: 1 })
      gsap.set(typo, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      })

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.dataset.introState = "done"
          document.documentElement.setAttribute("data-preloader-done", "true")
          document.documentElement.style.overflow = ""
          document.body.style.overflow = ""
          const activeLenis = getLenis()
          activeLenis?.start()
          setActive(false)
        },
      })

      // 0.0s – 0.7s: Z centralizado cresce sutilmente de 0.94 a 1.0
      tl.to(mono, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      })

      // 0.7s – 2.5s: Z desliza para a esquerda (comp x vai a 0) e logotipo desmascara à direita
      // Sem sobreposição pois estão em flex row com gap fixo (monoBox.right <= typoBox.left)
      tl.to(
        comp,
        {
          x: 0,
          duration: 1.8,
          ease: "power3.inOut",
        },
        0.7,
      )

      tl.to(
        typo,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 1.6,
          ease: "power3.out",
        },
        0.9,
      )

      // 2.5s – 3.3s: FLIP até o slot do header (#zuse-header-logo-slot)
      tl.add(() => {
        const slot = document.getElementById("zuse-header-logo-slot")
        if (!slot || !comp) return

        const slotRect = slot.getBoundingClientRect()
        const compRect = comp.getBoundingClientRect()

        // Altura alvo da logo no header (~26px)
        const targetHeight = Math.min(Math.max(slotRect.height * 0.75, 24), 32)
        const scaleFactor = targetHeight / (compRect.height || 180)

        // Centro do slot vs centro da comp
        const slotCenterX = slotRect.left + (slotRect.width * 0.4)
        const slotCenterY = slotRect.top + slotRect.height / 2
        const compCenterX = compRect.left + compRect.width / 2
        const compCenterY = compRect.top + compRect.height / 2

        const deltaX = slotCenterX - compCenterX
        const deltaY = slotCenterY - compCenterY

        // Disparar início da transição
        window.dispatchEvent(new Event("intro-travel-start"))

        gsap.to(comp, {
          x: deltaX,
          y: deltaY,
          scale: scaleFactor,
          duration: INTRO.travel,
          ease: "power3.inOut",
        })

        // Header fade in
        gsap.to("#zuse-main-header", {
          opacity: 1,
          duration: INTRO.travel,
          ease: "power2.out",
        })

        // Overlay fade out
        gsap.to(overlay, {
          opacity: 0,
          duration: INTRO.travel,
          ease: "power2.inOut",
        })
      }, 2.5)

      // 3.3s: Notificar término da animação do logo para disparar o Hero
      tl.add(() => {
        window.dispatchEvent(new Event("intro-complete"))
      }, 2.5 + INTRO.travel) // 3.3s

      // Tempo de espera para o reveal do hero concluir (~0.9s)
      tl.to({}, { duration: INTRO.reveal }, 2.5 + INTRO.travel)
    })

    return () => {
      ctx.revert()
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      const activeLenis = getLenis()
      activeLenis?.start()
    }
  }, [])

  if (!active) return null

  return (
    <div
      ref={overlayRef}
      id="zuse-intro-overlay"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0b0b0d] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Container de Composição Total (Z + Logotipo) */}
      <div
        ref={compositionRef}
        className="relative flex items-center justify-center gap-4 will-change-transform max-w-[min(560px,72vw)]"
      >
        {/* Monograma Z Grande */}
        <div
          ref={monoWrapperRef}
          className="relative flex shrink-0 items-center justify-center w-[clamp(140px,22vh,240px)] h-[clamp(140px,22vh,240px)]"
        >
          <ZuseMonogram className="h-full w-full drop-shadow-2xl" />
        </div>

        {/* Logotipo que desmascara da esquerda para a direita */}
        <div
          ref={typoWrapperRef}
          className="relative flex shrink-0 items-center justify-center h-[clamp(140px,22vh,240px)] overflow-hidden"
          style={{ width: "clamp(180px, 30vh, 320px)" }}
        >
          <ZuseLogotype className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  )
}
