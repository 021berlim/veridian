import type React from "react"
import { GFS_Didot, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { getPageMetadata } from "@/lib/seo"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const didot = GFS_Didot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-didot",
  display: "swap",
})

export const metadata = getPageMetadata("home")

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${didot.variable} font-sans antialiased`}>
        <SmoothScroll>
          {children}
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}