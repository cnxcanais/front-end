"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { authenticate } from "@/modules/login-components/login/infra/remote/authenticate"
import {
  loginFormSchema,
  LoginSchema,
} from "@/modules/login-components/login/infra/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export function LoginForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginFormSchema),
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isSubmitSuccessful) push("/dashboard")
  }, [isSubmitSuccessful, push])

  return (
    <form
      onSubmit={handleSubmit(authenticate)}
      className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <div className="flex justify-center">
        <h2 className="text-xl font-light">Faça o login para continuar</h2>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email">E-mail</label>
        <Input.Root variant={errors.email ? "error" : "secondary"}>
          <Input.Control {...register("email")} />
        </Input.Root>
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="password">Senha</label>
        <Input.Root variant={errors.password ? "error" : "secondary"}>
          <Input.Control
            {...register("password")}
            type={showPassword ? "text" : "password"}
          />
          <Input.Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ?
              <Eye className="h-5 w-5 text-yellow-100 hover:text-yellow-200" />
            : <EyeSlash className="h-5 w-5 text-yellow-100 hover:text-yellow-200" />
            }
          </Input.Icon>
        </Input.Root>
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <Link
        href="/define-password"
        className="text-xs text-yellow-100 hover:text-yellow-200">
        Esqueceu sua senha? clique aqui
      </Link>

      <Button disabled={isSubmitting} type="submit">
        Entrar
      </Button>
    </form>
  )
}
