const EMOJI_PATTERN =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FAFF}\u{200D}\u{20E3}]/gu

export function sanitizeVeraResponse(text: string): string {
  let result = text.trim()

  result = result.replace(EMOJI_PATTERN, "")
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1")
  result = result.replace(/__([^_]+)__/g, "$1")
  result = result.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, "$1")
  result = result.replace(/(?<!\w)_([^_]+)_(?!\w)/g, "$1")
  result = result.replace(/^#{1,6}\s+/gm, "")
  result = result.replace(/^[\s]*[-•*]\s+/gm, "")
  result = result.replace(/^\d+\.\s+/gm, "")
  result = result.replace(/\n{2,}/g, " ")
  result = result.replace(/\s{2,}/g, " ")

  return result.trim()
}