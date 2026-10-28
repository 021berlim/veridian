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

    // Se o usuário prefere movimento reduzido ou acessou via âncora direta (#contato etc.), pula intro
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
      // Estado Inicial garantido: Z centralizado em scale 0.94, Typo oculto
      gsap.set(overlay, { opacity: 1 })
      gsap.set(mono, { scale: 0.94, transformOrigin: "center center" })
      gsap.set(comp, { x: 0, y: 0, scale: 1 })
      gsap.set(typo, {
        opacity: 0,
        visibility: "hidden",
        clipPath: "inset(0 100% 0 0)",
      })

      // Mede dimensões reais para o cálculo da centralização composta
      const monoW = mono.offsetWidth || 180
      const typoW = typo.offsetWidth || 200
      const gap = 16
      // Para centralizar a dupla (Z + typo), o container desloca para a esquerda
      const shiftX = (gap + typoW) / 2

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

      // 0.7s: Torna o container do logotipo visível antes do reveal por clip-path
      tl.set(typo, { visibility: "visible" }, 0.7)

      // 0.7s – 2.5s: Z desliza suavemente para a esquerda enquanto o logotipo desmascara à direita
      // Sem sobreposição porque o logotipo fica posicionado à direita do Z com gap fixo
      tl.to(
        comp,
        {
          x: -shiftX,
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

      // 2.5s – 3.3s: FLIP suave até o slot do header (#zuse-header-logo-slot)
      tl.add(() => {
        const slot = document.getElementById("zuse-header-logo-slot")
        if (!slot || !comp || !mono) return

        const slotRect = slot.getBoundingClientRect()
        const compRect = comp.getBoundingClientRect()

        // Altura alvo da logo no header (28px no desktop, 24px no mobile)
        const isDesktop = window.innerWidth >= 640
        const targetH = isDesktop ? 28 : 24
        const scaleFactor = targetH / compRect.height

        // Coordenadas exatas onde a logo pousa no slot (alinhada à esquerda do slot e centralizada verticalmente)
        const targetX = slotRect.left
        const targetY = slotRect.top + (slotRect.height - targetH) / 2

        // Posição atual do topo-esquerdo do logo na intro
        const currentX = compRect.left
        const currentY = compRect.top

        const deltaX = targetX - currentX
        const deltaY = targetY - currentY

        // Ponto de origem no topo-esquerdo para sincronia perfeita com as coordenadas
        gsap.set(comp, { transformOrigin: "0 0" })

        // FLIP cinematográfico em direção ao header
        gsap.to(comp, {
          x: `+=${deltaX}`,
          y: `+=${deltaY}`,
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

        // Overlay dissolve suavemente revelando o site
        gsap.to(overlay, {
          opacity: 0,
          duration: INTRO.travel,
          ease: "power2.inOut",
        })
      }, 2.5)

      // 3.3s: Logo pousou no slot. Disparar evento para o navbar ativar o logo permanente
      tl.add(() => {
        window.dispatchEvent(new Event("intro-complete"))
        // Oculta a logo da intro após o pouso no header
        if (comp) gsap.set(comp, { opacity: 0 })
      }, 2.5 + INTRO.travel) // 3.3s

      // 3.3s – 4.2s: Tempo para revelação dos elementos do Hero
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
      {/* Container de Composição: Z no centro nativo, logotipo à direita fora do fluxo inicial */}
      <div
        ref={compositionRef}
        className="relative flex items-center will-change-transform"
      >
        {/* Monograma Z: elemento único em fluxo, centralizado desde o primeiro frame */}
        <div
          ref={monoWrapperRef}
          className="relative flex shrink-0 items-center justify-center w-[clamp(140px,22vh,240px)] h-[clamp(140px,22vh,240px)] will-change-transform"
          style={{ transform: "scale(0.94)" }}
        >
          <ZuseMonogram className="h-full w-full drop-shadow-2xl" />

          {/* Logotipo: ancorado à direita do Z, 100% oculto no SSR/HTML inicial (0 FOUC/flash) */}
          <div
            ref={typoWrapperRef}
            className="absolute left-[calc(100%+16px)] top-0 flex shrink-0 items-center justify-center h-full overflow-hidden will-change-transform"
            style={{
              width: "clamp(155px, 24vh, 260px)",
              opacity: 0,
              visibility: "hidden",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            <ZuseLogotype className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
