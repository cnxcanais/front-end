"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { resetPassword } from "@/modules/login-components/email-recovery/infra/remote/reset-password"
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/modules/login-components/email-recovery/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function PasswordResetForm() {
  const { handleSubmit, register } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit(data: ResetPasswordSchema) {
    try {
      const response = await resetPassword(data)
      toast.success(response)
    } catch (error) {
      toast.error("Erro ao resetar a senha: " + error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <h2 className="mb-2 text-xl font-light">
        Digite seu e-mail para resetar a senha
      </h2>

      <div className="mb-2 flex flex-col gap-3">
        <label className="text-lg" htmlFor="email">
          E-mail
        </label>
        <Input.Root variant="secondary">
          <Input.Control {...register("email")} type="email" />
        </Input.Root>
      </div>

      <Link href="/" className="text-xs text-yellow-100 hover:text-yellow-200">
        Voltar para login
      </Link>

      <Button type="submit">Resetar</Button>
    </form>
  )
}
