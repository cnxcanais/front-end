"use client"

import { useRouter } from "next/navigation"

export default function NotFound() {
  const { back } = useRouter()

  return (
    <main className="grid min-h-screen grid-cols-1 items-center bg-blue-500">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-lg">
          <p className="text-xl font-semibold text-white">404</p>
          <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Oops...
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-white sm:text-xl/8">
            Não encontramos o recurso requisitado.
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
      <footer className="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
        <div className="py-10">
          <nav className="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm/7 text-white lg:px-8">
            <a className="hover:underline" href="#">
              Suporte
            </a>
            <svg
              viewBox="0 0 2 2"
              aria-hidden="true"
              className="size-0.5 fill-gray-300">
              <circle r={1} cx={1} cy={1} />
            </svg>
            <a className="hover:underline" href="#">
              Status
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
