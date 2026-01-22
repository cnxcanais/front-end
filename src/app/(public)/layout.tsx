import Image from "next/image"

export default function LoginComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col bg-blue-500">
      <nav className="opacity-90">
        <div className="p-3">
          <Image
            className="h-20 w-auto"
            src="/images/cnx-logo.svg"
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
