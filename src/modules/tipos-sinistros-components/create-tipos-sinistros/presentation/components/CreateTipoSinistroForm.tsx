"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { queryClient } from "@/lib/react-query"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createTipoSinistro } from "../../infra/remote/create-tipo-sinistro"
import {
  CreateTipoSinistroSchema,
  createTipoSinistroFormSchema,
} from "../validation/schema"

export function CreateTipoSinistroForm({
  onSuccess,
  isModal = false,
}: {
  onSuccess?: (id: string) => void
  isModal?: boolean
}) {
  const { push } = useRouter()
  const { data: ramosData } = useRamoQuery(1, -1)
  const ramos = ramosData?.data || []

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateTipoSinistroSchema>({
    resolver: zodResolver(createTipoSinistroFormSchema),
  })

  async function onSubmit(data: CreateTipoSinistroSchema) {
    try {
      const response = await createTipoSinistro(
        data as { descricao: string; ramoId: string }
      )
      await queryClient.invalidateQueries({ queryKey: ["tipos-sinistros"] })
      toast.success("Tipo de sinistro criado com sucesso!")
      if (isModal && onSuccess) {
        onSuccess(response.id)
      } else {
        setTimeout(() => push("/tipos-sinistros"), 2000)
      }
    } catch (error) {
      toast.error(
        "Erro ao criar tipo de sinistro: " + error?.response?.data?.message
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
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="ramoId">Ramo *</label>
            <select
              {...register("ramoId")}
              className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="">Selecione um ramo</option>
              {ramos.map((ramo) => (
                <option key={ramo.id} value={ramo.id}>
                  {ramo.descricao}
                </option>
              ))}
            </select>
            {errors.ramoId && (
              <span className="text-xs text-red-500">
                {errors.ramoId.message}
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
            onClick={() => push("/tipos-sinistros")}
            variant="tertiary">
            Voltar
          </Button>
        )}
      </div>
    </form>
  )
}
