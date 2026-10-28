import type React from "react"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { Intro } from "@/components/ui/intro"
import { VeraChat } from "@/components/vera/vera-chat"
import { getPageMetadata } from "@/lib/seo"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata = getPageMetadata("home")

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0b0b0d] text-white selection:bg-[#c72c3b] selection:text-white`}>
        <Intro />
        <SmoothScroll>
          {children}
          <VeraChat />
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
