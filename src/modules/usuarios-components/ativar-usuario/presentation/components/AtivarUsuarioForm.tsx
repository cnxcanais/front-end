"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ativarUsuario } from "../../infra/remote/ativar-usuario"
import {
  AtivarUsuarioSchema,
  ativarUsuarioFormSchema,
} from "../validation/schema"

export function AtivarUsuarioForm() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<AtivarUsuarioSchema>({
    resolver: zodResolver(ativarUsuarioFormSchema),
  })

  async function onSubmit(data: AtivarUsuarioSchema) {
    if (!token) {
      toast.error("Token inválido")
      return
    }

    try {
      await ativarUsuario(token, data.senha)
      toast.success("Conta ativada com sucesso!")
      setTimeout(() => push("/"), 2000)
    } catch (error) {
      toast.error("Erro ao ativar conta: " + error)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Token inválido</h1>
          <p className="mt-2 text-gray-600">
            O link de ativação está inválido ou expirado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <div className="flex justify-center">
        <h2 className="text-xl font-light">Ativar Conta</h2>
      </div>
        
      <div className="flex flex-col gap-3">
        <label htmlFor="senha">Senha</label>
        <Input.Root variant={errors.senha ? "error" : "secondary"}>
          <Input.Control {...register("senha")} type="password" />
        </Input.Root>
        {errors.senha && (
          <span className="text-xs text-red-500">
            {errors.senha.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <Input.Root variant={errors.confirmarSenha ? "error" : "secondary"}>
          <Input.Control {...register("confirmarSenha")} type="password" />
        </Input.Root>
        {errors.confirmarSenha && (
          <span className="text-xs text-red-500">
            {errors.confirmarSenha.message}
          </span>
        )}
      </div>

      <div className="text-xs text-gray-300">
        <p>A senha deve conter:</p>
        <ul className="ml-4 list-disc">
          <li>Mínimo de 8 caracteres</li>
          <li>Pelo menos uma letra maiúscula</li>
          <li>Pelo menos um caractere especial</li>
        </ul>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Ativar Conta
      </Button>
    </form>
  )
}
