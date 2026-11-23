export const WHATSAPP_NUMBER = "5521971298668"
export const WHATSAPP_DISPLAY_NUMBER = "+55 (21) 97129-8668"

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Zuse Labs e gostaria de conversar com um especialista."

export interface WhatsAppLeadContext {
  fullName?: string
  company?: string
  role?: string
}

let currentLeadContext: WhatsAppLeadContext | null = null

export function setWhatsAppLeadContext(ctx: WhatsAppLeadContext | null): void {
  currentLeadContext = ctx
}

export function buildWhatsAppHref(message = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`
}

export function buildBriefingWhatsAppMessage(ctx: WhatsAppLeadContext): string {
  const name = ctx.fullName?.trim()
  const company = ctx.company?.trim()
  const role = ctx.role?.trim()
  const identity = [company, role].filter(Boolean).join(" — ")

  if (!name && !identity) {
    return DEFAULT_WHATSAPP_MESSAGE
  }

  const introName = name ? `Sou ${name}` : "Acabei de preencher meu contato"
  const identitySuffix = identity ? ` (${identity})` : ""
  return `Olá, time da Zuse Labs! ${introName}${identitySuffix}. Acabei de enviar o briefing pelo site e gostaria de agilizar o alinhamento da nossa reunião de diagnóstico.`
}

export function getContextualWhatsApp(): { href: string; isPersonalized: boolean } {
  const ctx = currentLeadContext
  const hasIdentity = Boolean(ctx?.fullName?.trim() || ctx?.company?.trim() || ctx?.role?.trim())

  if (!ctx || !hasIdentity) {
    return {
      href: buildWhatsAppHref(DEFAULT_WHATSAPP_MESSAGE),
      isPersonalized: false,
    }
  }

  return {
    href: buildWhatsAppHref(buildBriefingWhatsAppMessage(ctx)),
    isPersonalized: true,
  }
}

export const DEFAULT_WHATSAPP_HREF = buildWhatsAppHref()

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  const narrowViewport = window.innerWidth < 768
  const mobileUA = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
  return narrowViewport || mobileUA
}

export function openWhatsApp(customHref?: string, isPersonalizedOverride?: boolean): void {
  if (typeof window === "undefined") return

  const resolved = customHref
    ? { href: customHref, isPersonalized: isPersonalizedOverride ?? true }
    : getContextualWhatsApp()

  if (isMobileDevice()) {
    window.location.href = resolved.href
    return
  }

  window.dispatchEvent(
    new CustomEvent("zuse-open-whatsapp", {
      detail: resolved,
    }),
  )
}
