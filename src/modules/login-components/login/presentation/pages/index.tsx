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
    push("/dashboard")
  }

  return (
    <div className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <div className="flex justify-center">
        <h2 className="text-xl font-light">Faça o login para continuar</h2>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email">E-mail</label>
        <Input name="email" type="email" />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email">Password</label>
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
