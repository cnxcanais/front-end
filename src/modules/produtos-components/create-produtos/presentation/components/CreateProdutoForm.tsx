"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createProduto } from "../../infra/remote/create-produto"
import {
  CreateProdutoSchema,
  createProdutoFormSchema,
} from "../validation/schema"

export function CreateProdutoForm({
  onSuccess,
  isModal = false,
}: {
  onSuccess?: (produtoId: string) => void
  isModal?: boolean
}) {
  const { push } = useRouter()
  const { data: ramos } = useRamoQuery(1, 100)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateProdutoSchema>({
    resolver: zodResolver(createProdutoFormSchema),
  })

  const ramosOptions = useMemo(() => {
    if (!ramos) return []
    return ramos.data.map((ramo) => ({
      label: ramo.descricao,
      value: ramo.id,
    }))
  }, [ramos])

  async function onSubmit(data: {
    ramoId: string
    descricao: string
    seguroRenovavel: boolean
  }) {
    try {
      const response = await createProduto(data)
      toast.success("Produto criado com sucesso!")
      await queryClient.invalidateQueries({ queryKey: ["produtos"] })
      if (isModal && onSuccess) {
        onSuccess(response.id)
      } else {
        setTimeout(() => push("/produtos"), 2000)
      }
    } catch (error) {
      toast.error("Erro ao criar produto: " + error?.response?.data?.message)
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="ramoId">Ramo *</label>
            <select
              {...register("ramoId")}
              className="rounded border border-gray-300 p-2">
              <option value="">Selecione um ramo</option>
              {ramosOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.ramoId && (
              <span className="text-xs text-red-500">
                {errors.ramoId.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[40px] flex-1 flex-col gap-2">
            <label htmlFor="descricao">Renovável</label>
            <input {...register("seguroRenovavel")} type="checkbox" />
            {errors.seguroRenovavel && (
              <span className="text-xs text-red-500">
                {errors.seguroRenovavel.message}
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
        {!isModal && (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => push("/produtos")}
            variant="tertiary">
            Voltar
          </Button>
        )}
      </div>
    </form>
  )
}
