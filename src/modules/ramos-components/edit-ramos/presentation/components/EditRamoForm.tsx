"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useRamoByIdQuery } from "@/modules/ramos-components/edit-ramos/infra/hooks/use-ramo-by-id-query"
import { editRamo } from "@/modules/ramos-components/edit-ramos/infra/remote"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { EditRamoSchema, editRamoFormSchema } from "../validation/schema"

export function EditRamoForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: ramo, isLoading } = useRamoByIdQuery(id)
  const { refetch } = useRamoQuery()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditRamoSchema>({
    resolver: zodResolver(editRamoFormSchema),
    values: {
      id: ramo?.id || "",
      descricao: ramo?.descricao || "",
    },
  })

  async function onSubmit(data: { descricao: string; id: string }) {
    try {
      await editRamo(data)
      toast.success("Ramo editado com sucesso!")
      await queryClient.invalidateQueries({
        queryKey: ["ramos"],
      })
      setTimeout(() => push("/ramos"), 2000)
    } catch (error) {
      toast.error("Erro ao editar ramo: " + error)
    }
  }

  if (!ramo || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
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
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/ramos")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
