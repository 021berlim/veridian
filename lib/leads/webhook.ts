const PLACEHOLDER_PATTERNS = [
  /seu-webhook/i,
  /your-webhook/i,
  /example\.com/i,
  /placeholder/i,
  /changeme/i,
  /localhost/i,
]

export function isConfiguredWebhookUrl(url?: string | null): url is string {
  if (!url?.trim()) return false

  try {
    const parsed = new URL(url.trim())
    if (!["http:", "https:"].includes(parsed.protocol)) return false
    if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(parsed.hostname))) {
      return false
    }
    return true
  } catch {
    return false
  }
}