"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createContaContabil } from "../../infra/remote/create-conta-contabil"
import {
  CreateContaContabilSchema,
  createContaContabilFormSchema,
} from "../validation/schema"

export function CreateContaContabilForm() {
  const { push } = useRouter()
  const { data: corretoras } = useCorretoraQuery(1, -1)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateContaContabilSchema>({
    resolver: zodResolver(createContaContabilFormSchema),
  })

  const corretorasOptions = useMemo(() => {
    if (!corretoras) return []
    return corretoras.data.map((corretora) => ({
      label: corretora.razaoSocial,
      value: corretora.id,
    }))
  }, [corretoras])

  async function onSubmit(data: CreateContaContabilSchema) {
    try {
      await createContaContabil({
        corretoraId: data.corretoraId,
        codigo: data.codigo,
        descricao: data.descricao,
      })
      toast.success("Conta contábil criada com sucesso!")
      await queryClient.invalidateQueries({ queryKey: ["contas-contabeis"] })
      setTimeout(() => push("/contas-contabeis"), 2000)
    } catch (error) {
      toast.error(
        "Erro ao criar conta contábil: " + error?.response?.data?.message
      )
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="corretoraId">Corretora *</label>
            <select
              {...register("corretoraId")}
              className="rounded border border-gray-300 p-2">
              <option value="">Selecione uma corretora</option>
              {corretorasOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.corretoraId && (
              <span className="text-xs text-red-500">
                {errors.corretoraId.message}
              </span>
            )}
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
