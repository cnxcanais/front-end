"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useProdutoByIdQuery } from "@/modules/produtos-components/edit-produtos/infra/hooks/use-produto-by-id-query"
import { editProduto } from "@/modules/produtos-components/edit-produtos/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditProdutoSchema,
  editProdutoFormSchema,
} from "../validation/schema"

export function EditProdutoForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: produto, isLoading } = useProdutoByIdQuery(id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditProdutoSchema>({
    resolver: zodResolver(editProdutoFormSchema),
    values: {
      id: produto?.id || "",
      descricao: produto?.descricao || "",
    },
  })

  async function onSubmit(data: { descricao: string; id: string }) {
    try {
      await editProduto(data)
      toast.success("Produto editado com sucesso!")
      setTimeout(() => push("/produtos"), 2000)
    } catch (error) {
      toast.error("Erro ao editar produto: " + error)
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
          onClick={() => push("/produtos")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
