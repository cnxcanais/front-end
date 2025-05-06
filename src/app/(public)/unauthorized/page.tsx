"use client"

import { useRouter } from "next/navigation"

export default function Unauthorized() {
  const { back } = useRouter()

  return (
    <main className="grid min-h-full items-center">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-lg">
          <p className="text-xl font-semibold text-white">401</p>
          <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Acesso não autorizado
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-white sm:text-xl/8">
            Parece que você não tem permissão para acessar esta página.
          </p>
          <div className="mt-10">
            <div
              onClick={back}
              className="cursor-pointer text-sm/7 font-semibold text-white hover:underline">
              <span aria-hidden="true">&larr;</span> Voltar para a página
              anterior
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
