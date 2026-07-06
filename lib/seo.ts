import type { Metadata } from "next"
import { faqs, services, siteConfig } from "@/data/site"

type PageKey = keyof typeof siteConfig.pages

const defaultOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Banner Veridian Capital — estratégia, design e tecnologia para marcas de alto valor",
}

export function getPageMetadata(page: PageKey = "home"): Metadata {
  const pageMeta = siteConfig.pages[page]
  const canonical = page === "home" ? siteConfig.url : `${siteConfig.url}/${page}`

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageMeta.title,
      description: pageMeta.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
      images: [defaultOgImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    other: {
      "ai-content-declaration": "human-authored",
    },
  }
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/brand/logotipo.svg`,
    image: `${siteConfig.url}/images/brand/banner.svg`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    sameAs: siteConfig.socialLinks.map((link) => link.url),
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    knowsAbout: [
      "Marketing digital",
      "Desenvolvimento de software",
      "Design de experiência",
      "Consultoria digital",
      "Branding premium",
    ],
  }
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function getWebPageSchema() {
  const pageMeta = siteConfig.pages.home

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: pageMeta.title,
    description: pageMeta.description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/og-image.png`,
    },
  }
}

export function getServiceSchemas() {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/#service-${service.number}`,
    name: service.title,
    description: service.description,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: service.title,
    url: `${siteConfig.url}/#servicos`,
  }))
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function getHomeStructuredData() {
  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getWebPageSchema(),
    ...getServiceSchemas(),
    getFaqSchema(),
  ]
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}