"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useContaContabilByIdQuery } from "@/modules/contas-contabeis-components/edit-conta-contabil/infra/hooks/use-conta-contabil-by-id-query"
import { editContaContabil } from "@/modules/contas-contabeis-components/edit-conta-contabil/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { EditContaContabilSchema, editContaContabilFormSchema } from "../validation/schema"

export function EditContaContabilForm({ id }: Readonly<{ id: string }>) {
  const { push } = useRouter()
  const { data: contaContabil, isLoading } = useContaContabilByIdQuery(id)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditContaContabilSchema>({
    resolver: zodResolver(editContaContabilFormSchema),
    values: {
      id: contaContabil?.id || "",
      codigo: contaContabil?.codigo || "",
      descricao: contaContabil?.descricao || "",
    },
  })

  async function onSubmit(data: EditContaContabilSchema) {
    try {
      await editContaContabil({
        id: data.id,
        codigo: data.codigo,
        descricao: data.descricao,
      })
      toast.success("Conta contábil editada com sucesso!")
      await queryClient.invalidateQueries({ queryKey: ["contas-contabeis"] })
      setTimeout(() => push("/contas-contabeis"), 2000)
    } catch (error) {
      toast.error("Erro ao editar conta contábil: " + error?.response?.data?.message)
    }
  }

  if (!contaContabil || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="corretoraId">Corretora</label>
            <Input.Root>
              <Input.Control
                value={contaContabil?.corretora?.nomeFantasia || "-"}
                type="text"
                disabled
              />
            </Input.Root>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="codigo">Código *</label>
            <Input.Root variant={errors.codigo ? "error" : "primary"}>
              <Input.Control {...register("codigo")} type="text" />
            </Input.Root>
            {errors.codigo && (
              <span className="text-xs text-red-500">
                {errors.codigo.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="descricao">Descrição *</label>
            <Input.Root variant={errors.descricao ? "error" : "primary"}>
              <Input.Control {...register("descricao")} type="text" />
            </Input.Root>
            {errors.descricao && (
              <span className="text-xs text-red-500">
                {errors.descricao.message}
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
          onClick={() => push("/contas-contabeis")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
