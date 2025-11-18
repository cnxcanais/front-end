"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useGrupoEconomicoByIdQuery } from "@/modules/grupos-economicos-components/edit-grupos-economicos/infra/hooks/use-grupo-economico-by-id-query"
import { editGrupoEconomico } from "@/modules/grupos-economicos-components/edit-grupos-economicos/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditGrupoEconomicoSchema,
  editGrupoEconomicoFormSchema,
} from "../validation/schema"

export function EditGrupoEconomicoForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: grupoEconomico, isLoading } = useGrupoEconomicoByIdQuery(id)
  console.log("grupoEconomico", grupoEconomico)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditGrupoEconomicoSchema>({
    resolver: zodResolver(editGrupoEconomicoFormSchema),
    values: {
      id: grupoEconomico?.id || "",
      nome: grupoEconomico?.nome || "",
    },
  })

  async function onSubmit(data: { nome: string; id: string }) {
    try {
      await editGrupoEconomico(data)
      toast.success("Grupo Econômico editado com sucesso!")
      setTimeout(() => push("/grupos-economicos"), 2000)
    } catch (error) {
      toast.error("Erro ao editar grupo econômico: " + error)
    }
  }

  if (!grupoEconomico || isLoading) return <LoadingScreen />

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
