"use client"

import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import { InputPassword } from "@/modules/login-components/login/presentation/components/InputPassword"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Login() {
  const { push } = useRouter()

  return (
    <div className="text-white bg-black flex min-w-96 flex-col gap-3 rounded-lg p-7">
      <div className="flex justify-center">
        <h2 className="text-xl font-light">Faça o login para continuar</h2>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg" htmlFor="email">
          E-mail
        </label>
        <Input name="email" type="email" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg" htmlFor="email">
          Password
        </label>
        <InputPassword />
      </div>

      <Link
        href="/define-password"
        className="text-xs text-yellow-100 hover:text-yellow-200">
        Esqueceu sua senha? clique aqui
      </Link>

      <Button onClick={() => push("/dashboard")}>Entrar</Button>
    </div>
  )
}
