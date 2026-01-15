"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useProdutoByIdQuery } from "@/modules/produtos-components/edit-produtos/infra/hooks/use-produto-by-id-query"
import { editProduto } from "@/modules/produtos-components/edit-produtos/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { EditProdutoSchema, editProdutoFormSchema } from "../validation/schema"

export function EditProdutoForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: produto, isLoading } = useProdutoByIdQuery(id)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditProdutoSchema>({
    resolver: zodResolver(editProdutoFormSchema),
    values: {
      id: produto?.id || "",
      descricao: produto?.descricao || "",
      seguroRenovavel: produto?.seguroRenovavel || false,
    },
  })

  async function onSubmit(data: {
    descricao: string
    id: string
    seguroRenovavel: boolean
  }) {
    try {
      await editProduto(data)
      toast.success("Produto editado com sucesso!")
      await queryClient.invalidateQueries({ queryKey: ["produtos"] })
      setTimeout(() => push("/produtos"), 2000)
    } catch (error) {
      toast.error("Erro ao editar produto: " + error?.response?.data?.message)
    }
  }

  if (!produto || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="ramoId">Ramo *</label>
            <Input.Root>
              <Input.Control
                value={produto?.ramo?.descricao}
                type="text"
                disabled
              />
            </Input.Root>
          </div>

          <div className="flex max-w-[40px] flex-1 flex-col gap-2">
            <label htmlFor="descricao">Renovável</label>
            <input
              {...register("seguroRenovavel", {
                setValueAs: (v) => v === "true" || v === true,
              })}
              type="checkbox"
            />
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
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/produtos")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
