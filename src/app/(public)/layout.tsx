"use client"

import Image from "next/image"
import { useEffect } from "react"

export default function LoginComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // inclui este useEffect pois quando sai das paginas authorized e volta
  // o body fica com um paddingLeft por conta da Sidebar
  useEffect(() => {
    document.body.style.paddingLeft = "0rem"
  }, [])

  return (
    <div className="flex h-screen flex-col bg-blue-500">
      <nav className="bg-black/60 opacity-90">
        <div className="p-2.5">
          <Image
            className="h-24 w-auto"
            src="/images/light-logo.png"
            alt="Logo"
            width={400}
            height={400}
          />
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  )
}
