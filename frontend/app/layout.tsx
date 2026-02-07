import React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GOJUSTORE | گوجو استور",
  description:
    "گوجو استور - فروشگاه آنلاین خرید محصولات دیجیتال، کروپک فورتنایت، تلگرام پریمیوم، اکانت هوش مصنوعی و پنل مرزبان",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  )
}
