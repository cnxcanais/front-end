"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createRamo } from "../../infra/remote/create-ramo"
import { CreateRamoSchema, createRamoFormSchema } from "../validation/schema"

export function CreateRamoForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateRamoSchema>({
    resolver: zodResolver(createRamoFormSchema),
  })

  async function onSubmit(data: { descricao: string }) {
    try {
      await createRamo(data)
      toast.success("Ramo criado com sucesso!")
      setTimeout(() => push("/ramos"), 2000)
    } catch (error) {
      toast.error("Erro ao criar ramo: " + error?.response?.data?.message)
    }
  }

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
