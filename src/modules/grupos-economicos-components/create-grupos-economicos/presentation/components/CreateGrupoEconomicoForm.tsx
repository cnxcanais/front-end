"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createGrupoEconomico } from "../../infra/remote/create-grupo-economico"
import {
  CreateGrupoEconomicoSchema,
  createGrupoEconomicoFormSchema,
} from "../validation/schema"

export function CreateGrupoEconomicoForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateGrupoEconomicoSchema>({
    resolver: zodResolver(createGrupoEconomicoFormSchema),
  })

  async function onSubmit(data: { nome: string }) {
    try {
      await createGrupoEconomico(data)
      toast.success("Grupo Econômico criado com sucesso!")
      setTimeout(() => push("/grupos-economicos"), 2000)
    } catch (error) {
      toast.error("Erro ao criar grupo econômico: " + error)
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
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
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/grupos-economicos")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
