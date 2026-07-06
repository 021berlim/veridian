import { serializeJsonLd } from "@/lib/seo"

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

export function JsonLd({ data }: JsonLdProps) {
  const graphs = Array.isArray(data) ? data : [data]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({
          "@context": "https://schema.org",
          "@graph": graphs.map((item) => {
            const { ["@context"]: _context, ...rest } = item
            return rest
          }),
        }),
      }}
    />
  )
}