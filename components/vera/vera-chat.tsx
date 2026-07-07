"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CAPTURE_ACKNOWLEDGMENTS,
  CAPTURE_PROMPTS,
  CAPTURE_THRESHOLD,
} from "@/lib/vera/constants"
import type {
  CaptureStep,
  ChatMessage,
  ConversationPhase,
  LeadPayload,
  PartialLead,
} from "@/lib/vera/types"
import {
  detectLeadIntent,
  getNextCaptureStep,
  validateCaptureInput,
} from "@/lib/vera/validation"
import { useLenis } from "lenis/react"

const INITIAL_GREETING =
  "Oi, que bom te ver por aqui. Sou a Vera, da Veridian Capital, e minha função é te ajudar com tudo relacionado aos nossos serviços, que vão de marketing digital e desenvolvimento de software a design, experiência e consultoria digital. Pensa em mim como sua concierge pessoal pra tudo que sua marca precisa no mundo digital. Me conta o que você tem em mente, tô aqui pra ouvir e te ajudar a encontrar a melhor solução."

const CAPTURE_TRANSITION =
  "Que bom saber do seu interesse, vou anotar seus dados pra nossa equipe montar uma proposta pensada no que você precisa."

const COMPLETION_MESSAGE =
  "Pronto, já passei tudo pro time e a gente volta em breve com uma proposta. Se precisar de mais alguma coisa, é só chamar."

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: Date.now(),
  }
}

function trapWheelEvent(event: React.WheelEvent) {
  event.stopPropagation()
}

export function VeraChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [phase, setPhase] = useState<ConversationPhase>("chat")
  const [captureStep, setCaptureStep] = useState<CaptureStep | null>(null)
  const [lead, setLead] = useState<PartialLead>({})
  const [interactionCount, setInteractionCount] = useState(0)
  const [hasGreeted, setHasGreeted] = useState(false)

  const lenis = useLenis()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([createMessage("assistant", INITIAL_GREETING)])
      setHasGreeted(true)
    }
  }, [isOpen, hasGreeted])

  useEffect(() => {
    if (!isOpen) return

    lenis?.stop()

    const frame = window.setTimeout(() => {
      scrollToBottom()
      inputRef.current?.focus({ preventScroll: true })
    }, 280)

    return () => {
      window.clearTimeout(frame)
      lenis?.start()
    }
  }, [isOpen, lenis, scrollToBottom])

  const appendMessage = useCallback((role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, createMessage(role, content)])
  }, [])

  const callVeraAI = useCallback(
    async (history: ChatMessage[], currentPhase: ConversationPhase, currentLead: PartialLead) => {
      const response = await fetch("/api/vera/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          phase: currentPhase,
          lead: currentLead,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error ?? "Não consegui responder agora. Tenta de novo?")
      }

      const data = await response.json()
      return data.content as string
    },
    [],
  )

  const submitLead = useCallback(async (payload: LeadPayload) => {
    const response = await fetch("/api/vera/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error ?? "Não consegui enviar seus dados. Tenta de novo?")
    }
  }, [])

  const startCapture = useCallback(() => {
    setPhase("capture")
    const firstStep = getNextCaptureStep(lead) ?? "name"
    setCaptureStep(firstStep)
    appendMessage("assistant", CAPTURE_TRANSITION)
    appendMessage("assistant", CAPTURE_PROMPTS[firstStep])
  }, [appendMessage, lead])

  const handleCaptureInput = useCallback(
    async (userInput: string) => {
      if (!captureStep || captureStep === "complete") return

      const validation = validateCaptureInput(captureStep, userInput)

      if (!validation.valid) {
        appendMessage("assistant", validation.error ?? "Não entendi bem. Pode mandar de novo?")
        return
      }

      const fieldMap: Record<Exclude<CaptureStep, "complete">, keyof LeadPayload> = {
        name: "name",
        email: "email",
        company: "company",
        projectType: "projectType",
        message: "message",
      }

      const field = fieldMap[captureStep]
      const updatedLead: PartialLead = {
        ...lead,
        [field]: validation.normalized,
      }

      setLead(updatedLead)

      const nextStep = getNextCaptureStep(updatedLead)

      if (captureStep !== "message") {
        appendMessage(
          "assistant",
          `${CAPTURE_ACKNOWLEDGMENTS[captureStep as keyof typeof CAPTURE_ACKNOWLEDGMENTS]} ${nextStep ? CAPTURE_PROMPTS[nextStep] : ""}`.trim(),
        )
      }

      if (!nextStep) {
        setCaptureStep("complete")
        setPhase("complete")

        try {
          await submitLead(updatedLead as LeadPayload)
          appendMessage("assistant", COMPLETION_MESSAGE)
        } catch {
          appendMessage(
            "assistant",
            "Anotei tudo aqui, mas deu um erro ao enviar. Tenta de novo ou usa o formulário de contato.",
          )
        }
        return
      }

      setCaptureStep(nextStep)
    },
    [appendMessage, captureStep, lead, submitLead],
  )

  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setInput("")
    appendMessage("user", trimmed)
    setIsLoading(true)

    try {
      if (phase === "capture" && captureStep && captureStep !== "complete") {
        await handleCaptureInput(trimmed)
        return
      }

      if (phase === "complete") {
        const history = [...messages, createMessage("user", trimmed)]
        const reply = await callVeraAI(history, "complete", lead as PartialLead)
        appendMessage("assistant", reply)
        return
      }

      const newCount = interactionCount + 1
      setInteractionCount(newCount)

      const shouldCapture =
        detectLeadIntent(trimmed) || newCount >= CAPTURE_THRESHOLD

      const history = [...messages, createMessage("user", trimmed)]
      const reply = await callVeraAI(history, "chat", lead)
      appendMessage("assistant", reply)

      if (shouldCapture && phase === "chat") {
        startCapture()
      }
    } catch (error) {
      appendMessage(
        "assistant",
        error instanceof Error
          ? error.message
          : "Desculpa, tive um probleminha aqui. Tenta de novo em instantes.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [
    appendMessage,
    callVeraAI,
    captureStep,
    handleCaptureInput,
    input,
    interactionCount,
    isLoading,
    lead,
    messages,
    phase,
    startCapture,
  ])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="vera-chat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onWheel={trapWheelEvent}
            onTouchMove={(event) => event.stopPropagation()}
            className="flex h-[min(560px,calc(100vh-2.5rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
            role="dialog"
            aria-label="V.E.R.A. Chat"
            aria-modal="true"
          >
            <header className="flex items-start justify-between border-b border-border/60 px-5 py-4">
              <div className="min-w-0 pr-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  V.E.R.A.
                </p>
                <p className="mt-1 font-serif text-sm leading-snug text-foreground">
                  Sua assistente na Veridian
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar chat"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </header>

            <div
              ref={scrollRef}
              onWheel={trapWheelEvent}
              className="vera-scrollbar vera-chat-scroll flex-1 space-y-3 overflow-y-auto bg-background/50 px-5 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-foreground text-primary-foreground"
                        : "border border-border/60 bg-secondary text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary px-3.5 py-2.5">
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      Um momento
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              onWheel={trapWheelEvent}
              className="border-t border-border/60 bg-card px-5 py-4"
            >
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="O que você precisa?"
                  rows={1}
                  disabled={isLoading}
                  className="max-h-24 min-h-[40px] flex-1 resize-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar mensagem"
                  className="h-9 w-9 shrink-0 rounded-full bg-foreground text-primary-foreground hover:bg-foreground/90"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {phase === "capture"
                  ? `Cadastro · ${captureStep ?? "..."}`
                  : "Conversa aberta"}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vera-trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
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
                whileHover={{
                  scale: 1.04,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(true)}
                aria-label="Abrir V.E.R.A. — Assistente Veridian"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background/75 text-foreground shadow-sm backdrop-blur-xl transition-colors duration-300 hover:border-border hover:bg-background/90"
              >
                <span className="font-serif text-base tracking-wide">V</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}