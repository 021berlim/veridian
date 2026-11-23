"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink, Smartphone, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa6"
import { QRCodeSVG } from "qrcode.react"
import { useLenis } from "lenis/react"
import {
  DEFAULT_WHATSAPP_HREF,
  WHATSAPP_DISPLAY_NUMBER,
  openWhatsApp,
} from "@/lib/whatsapp"

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const

export function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(DEFAULT_WHATSAPP_HREF)
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [copied, setCopied] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string; isPersonalized?: boolean }>).detail
      setActiveHref(detail?.href || DEFAULT_WHATSAPP_HREF)
      setIsPersonalized(Boolean(detail?.isPersonalized))
      setCopied(false)
      setOpen(true)
    }
    window.addEventListener("zuse-open-whatsapp", onOpen)
    return () => window.removeEventListener("zuse-open-whatsapp", onOpen)
  }, [])

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_DISPLAY_NUMBER)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignora se indisponível
    }
  }

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      lenis?.start()
    }
  }, [open, lenis])

  return (
    <>
      {/* Botão flutuante minimalista */}
      <div className="fixed right-5 bottom-5 z-50 transition-opacity duration-200 [[data-zoom-open=true]_&]:pointer-events-none [[data-zoom-open=true]_&]:opacity-0">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <motion.button
            type="button"
            onClick={() => openWhatsApp()}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }}
            whileTap={{ scale: 0.96 }}
            aria-label="Iniciar conversa no WhatsApp da Zuse Labs"
            title="Falar no WhatsApp"
            className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#111114]/85 text-[#d4d7dd] shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors duration-300 hover:border-[#c72c3b] hover:bg-[#16161b]"
          >
            <FaWhatsapp
              aria-hidden="true"
              className="h-6 w-6 transition-all duration-300 group-hover:scale-105 group-hover:text-[#c72c3b]"
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Sidebar Desktop com QR Code */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] hidden md:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Falar com um especialista no WhatsApp"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: EASE_EDITORIAL }}
              className="absolute top-0 right-0 flex h-full w-full max-w-[410px] flex-col justify-between border-l border-white/10 bg-[#0b0b0d] p-8 text-white shadow-2xl sm:p-10"
            >
              {/* Topo */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-[#c72c3b]">
                  <FaWhatsapp className="h-4 w-4" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
                    WhatsApp Zuse Labs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar painel do WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#8a8f98] transition-colors hover:border-white/30 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Centro — Título, QR Code e texto corrido */}
              <div className="my-auto flex flex-col items-center py-6 text-center">
                <h2 className="font-sans text-2xl font-light leading-snug tracking-[-0.02em] text-white sm:text-[26px]">
                  Escaneie o QR Code e fale com um especialista
                </h2>

                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8a8f98]">
                  {isPersonalized
                    ? "Seu QR Code já está pronto com sua identificação preenchida."
                    : "Aponte a câmera do seu celular para iniciar a conversa com nossa equipe."}
                </p>

                <div className="mt-8 rounded-2xl bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                  <QRCodeSVG
                    value={activeHref}
                    size={212}
                    bgColor="#ffffff"
                    fgColor="#0b0b0d"
                    level="M"
                  />
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-[#d4d7dd]">
                  <Smartphone className="h-3.5 w-3.5 text-[#c72c3b]" />
                  <span>Abra a câmera do celular e aponte para o código</span>
                </div>

                <p className="mt-3 max-w-xs text-xs leading-relaxed text-[#6b7280]">
                  Caso não consiga escanear, você também pode adicionar nosso número diretamente:{" "}
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    title="Clique para copiar o número"
                    className="cursor-pointer font-mono text-[#c9cdd4] transition-colors duration-200 hover:text-[#c72c3b]"
                  >
                    {WHATSAPP_DISPLAY_NUMBER}
                  </button>
                  {copied && (
                    <span className="ml-1.5 font-mono text-[10px] uppercase tracking-wider text-[#c72c3b]">
                      (copiado)
                    </span>
                  )}
                  .
                </p>
              </div>

              {/* Rodapé — Apenas botão WhatsApp Web */}
              <div className="border-t border-white/[0.08] pt-6">
                <a
                  href={activeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c72c3b] py-3 text-sm font-medium text-white transition-colors hover:bg-[#a61f2c]"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Abrir no WhatsApp Web
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
