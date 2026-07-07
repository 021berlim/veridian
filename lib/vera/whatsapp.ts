import type { VeraChatMessage } from "./openrouter"

export function parseWhatsAppHistory(
  history: unknown,
): VeraChatMessage[] {
  if (!history) return []

  if (Array.isArray(history)) {
    return history
      .filter(
        (item): item is VeraChatMessage =>
          typeof item === "object" &&
          item !== null &&
          "role" in item &&
          "content" in item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string",
      )
      .map((item) => ({
        role: item.role,
        content: item.content.trim(),
      }))
      .filter((item) => item.content.length > 0)
  }

  if (typeof history === "string" && history.trim()) {
    try {
      return parseWhatsAppHistory(JSON.parse(history))
    } catch {
      return []
    }
  }

  return []
}

export function appendToHistory(
  history: VeraChatMessage[],
  role: VeraChatMessage["role"],
  content: string,
): VeraChatMessage[] {
  const trimmed = content.trim()
  if (!trimmed) return history
  return [...history, { role, content: trimmed }]
}