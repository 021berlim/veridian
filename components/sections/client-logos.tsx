"use client"

import type { TrustedClientId } from "@/data/site"

interface ClientLogoMarkProps {
  id: TrustedClientId
  className?: string
}

/**
 * Emblemas vetoriais arquiteturais (monocromáticos, alta precisão geométrica)
 * projetados sob medida para empresas fictícias de grande porte.
 */
export function ClientLogoMark({ id, className = "h-7 w-7 sm:h-8 sm:w-8" }: ClientLogoMarkProps) {
  switch (id) {
    /* VALKORA — Prisma angular duplo / brasão aeroindustrial */
    case "valkora":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <path
            d="M4 7.5L18 31L32 7.5H25.2L18 19.8L10.8 7.5H4Z"
            fill="currentColor"
          />
          <path
            d="M14.2 7.5L18 14.2L21.8 7.5H14.2Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
          <path d="M9.5 4.5H26.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    /* KRONOS — Monólito de ampulheta / pilares institucionais de capital */
    case "kronos":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <rect x="6" y="4.5" width="24" height="3" fill="currentColor" />
          <rect x="6" y="28.5" width="24" height="3" fill="currentColor" />
          <path
            d="M8.5 9.5H27.5L19.8 18L27.5 26.5H8.5L16.2 18L8.5 9.5Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="miter"
          />
          <rect x="16.5" y="16.5" width="3" height="3" fill="currentColor" />
        </svg>
      )

    /* AETHERIS — Anéis orbitais de bioengenharia com núcleo de precisão */
    case "aetheris":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <ellipse
            cx="18"
            cy="18"
            rx="14"
            ry="6.5"
            transform="rotate(-35 18 18)"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <ellipse
            cx="18"
            cy="18"
            rx="14"
            ry="6.5"
            transform="rotate(35 18 18)"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeOpacity="0.65"
          />
          <polygon points="18,12.5 22.8,18 18,23.5 13.2,18" fill="currentColor" />
        </svg>
      )

    /* MONOLITH — Três blocos brutalistas isométricos com corte estrutural */
    case "monolith":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <path d="M5 10L12.5 5.5V30.5L5 26V10Z" fill="currentColor" fillOpacity="0.55" />
          <path d="M14.5 4.5H21.5V31.5H14.5V4.5Z" fill="currentColor" />
          <path d="M23.5 5.5L31 10V26L23.5 30.5V5.5Z" fill="currentColor" fillOpacity="0.82" />
        </svg>
      )

    /* VERDANTIA — Escudo geométrico facetado / folha arquitetural */
    case "verdantia":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <path
            d="M18 3.5L30.5 9.5V19.5C30.5 25.8 25.2 30.4 18 32.8C10.8 30.4 5.5 25.8 5.5 19.5V9.5L18 3.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M18 7.5L26.5 12V19.2C26.5 23.4 22.9 26.8 18 28.6V7.5Z" fill="currentColor" />
          <path d="M18 14L12.2 19.5L18 22.2V14Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      )

    /* NEXAERO — Asa delta supersônica em vetor de velocidade */
    case "nexaero":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <path d="M4 25.5L31.5 8.5L23.8 27.5L17.8 21.5L4 25.5Z" fill="currentColor" />
          <path d="M17.8 21.5L31.5 8.5L13.2 28.5L17.8 21.5Z" fill="currentColor" fillOpacity="0.4" />
          <path d="M5 17.5L16.5 14" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )

    /* SOLARIS — Octógono solar de matriz energética com raios de precisão */
    case "solaris":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <polygon
            points="18,4 27.9,8.1 32,18 27.9,27.9 18,32 8.1,27.9 4,18 8.1,8.1"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <polygon
            points="18,9.5 24,12 26.5,18 24,24 18,26.5 12,24 9.5,18 12,12"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <circle cx="18" cy="18" r="4.2" fill="currentColor" />
          <path
            d="M18 4V9.5M18 26.5V32M4 18H9.5M26.5 18H32"
            stroke="currentColor"
            strokeWidth="1.75"
          />
        </svg>
      )

    /* OBSIDIAN — Cristal hexagonal facetado corporativo */
    case "obsidian":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <polygon
            points="18,3.5 30.5,10.75 30.5,25.25 18,32.5 5.5,25.25 5.5,10.75"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <polygon points="18,3.5 30.5,10.75 18,18" fill="currentColor" />
          <polygon points="18,18 30.5,25.25 18,32.5" fill="currentColor" fillOpacity="0.65" />
          <polygon points="5.5,10.75 18,18 5.5,25.25" fill="currentColor" fillOpacity="0.35" />
        </svg>
      )
  }
}
