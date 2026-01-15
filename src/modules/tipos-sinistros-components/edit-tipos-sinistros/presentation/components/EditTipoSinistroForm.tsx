"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTipoSinistroByIdQuery } from "../../infra/hooks/use-tipo-sinistro-by-id-query"
import { editTipoSinistro } from "../../infra/remote"
import {
  EditTipoSinistroSchema,
  editTipoSinistroFormSchema,
} from "../validation/schema"

export function EditTipoSinistroForm({ id }: { id: string }) {
  const { push } = useRouter()
  const { data: tipoSinistro, isLoading } = useTipoSinistroByIdQuery(id)
  const { data: ramosData } = useRamoQuery(1, -1)
  const ramos = ramosData?.data || []
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditTipoSinistroSchema>({
    resolver: zodResolver(editTipoSinistroFormSchema),
    values: {
      id: tipoSinistro?.id || "",
      descricao: tipoSinistro?.descricao || "",
    },
  })

  async function onSubmit(data: EditTipoSinistroSchema) {
    try {
      await editTipoSinistro(data as { id: string; descricao: string })
      toast.success("Tipo de sinistro editado com sucesso!")
      await queryClient.invalidateQueries({
        queryKey: ["tipos-sinistros"],
      })
      setTimeout(() => push("/tipos-sinistros"), 2000)
    } catch (error) {
      toast.error("Erro ao editar tipo de sinistro: " + error)
    }
  }

  if (!tipoSinistro || isLoading) return <LoadingScreen />

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
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/tipos-sinistros")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
