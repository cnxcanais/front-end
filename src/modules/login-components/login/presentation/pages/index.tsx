"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Login() {
  const { push } = useRouter()
  const [user, setUser] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    sessionStorage.setItem("roleName", "admin")

    sessionStorage.setItem("accountId", "ec86dcb8-b6df-4a9f-890b-d9fec35ec8d1")
    push("/dashboard")
  }

  return (
    <div className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <div className="flex justify-center">
        <h2 className="text-xl font-light">Faça o login para continuar</h2>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email">E-mail</label>
        <Input.Root variant="secondary">
          <Input.Control />
        </Input.Root>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email">Password</label>
        <Input.Root variant="secondary">
          <Input.Control type={showPassword ? "text" : "password"} />
          <Input.Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ?
              <Eye className="h-5 w-5 text-yellow-100 hover:text-yellow-200" />
            : <EyeSlash className="h-5 w-5 text-yellow-100 hover:text-yellow-200" />
            }
          </Input.Icon>
        </Input.Root>
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
