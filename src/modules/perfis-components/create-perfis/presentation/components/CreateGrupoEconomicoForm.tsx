"use client"

import { Perfil } from "@/@types/perfil"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createPerfil } from "../../infra/remote/create-perfil"
import {
  CreatePerfilSchema,
  createPerfilFormSchema,
} from "../validation/schema"

export function CreatePerfilForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreatePerfilSchema>({
    resolver: zodResolver(createPerfilFormSchema),
  })

  async function onSubmit(data: Perfil.CreateRequest) {
    try {
      await createPerfil(data)
      toast.success("Perfil criado com sucesso!")
      setTimeout(() => push("/perfis"), 2000)
    } catch (error) {
      toast.error("Erro ao criar perfil: " + error)
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados do Perfil</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="nome">Nome</label>
            <Input.Root variant={errors.nome ? "error" : "primary"}>
              <Input.Control {...register("nome")} type="text" />
            </Input.Root>
            {errors.nome && (
              <span className="text-xs text-red-500">
                {errors.nome.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="descricao">Descrição</label>
            <Input.Root variant={errors.descricao ? "error" : "primary"}>
              <Input.Control {...register("descricao")} type="text" />
            </Input.Root>
            {errors.descricao && (
              <span className="text-xs text-red-500">
                {errors.descricao.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="isSistema">Sistema</label>
            <div className="flex h-10 items-center">
              <input
                {...register("isSistema")}
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-gray-300"
              />
            </div>
            {errors.isSistema && (
              <span className="text-xs text-red-500">
                {errors.isSistema.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/perfis")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
