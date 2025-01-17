"use client"

import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import { InputPassword } from "@/modules/login-components/login/presentation/components/InputPassword"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Login() {
  const { push } = useRouter()

  const handleLogin = () => {
    sessionStorage.setItem("roleName", "admin")
    sessionStorage.setItem("accountId", "ec86dcb8-b6df-4a9f-890b-d9fec35ec8d1")
    push("/dashboard")
  }

  return (
    <div className="flex min-w-96 flex-col gap-3 rounded-lg bg-black p-7 text-white">
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

      <Button onClick={handleLogin}>Entrar</Button>
    </div>
  )
}
