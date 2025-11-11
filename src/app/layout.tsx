import { ReactQueryProvider } from "@/core/providers"
import { MSWProvider } from "@/core/providers/msw-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CNX Seguros",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="icon"
          href="/images/favicon.svg"
          sizes="any"
          type="image/svg+xml"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MSWProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster richColors position="top-right" />
        </MSWProvider>
      </body>
    </html>
  )
}
