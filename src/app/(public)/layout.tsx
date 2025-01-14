"use client"
import Image from 'next/image'

export default function LoginComponentsLayout ({children}: {children: React.ReactNode}) {
  
  return(
    <>
      <nav className="bg-blue-200 m-0">
        <div className="p-2.5">
          <Image src="/images/logo.svg" alt="Logo" width={100} height={50}/>
        </div>
      </nav>
      <main className="flex h-screen justify-center items-center bg-blue-500">
        {children}
      </main>
    </>
  )
}