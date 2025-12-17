"use client"

import { Perfil } from "@/@types/perfil"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { usePerfilByIdQuery } from "../../infra/hooks/use-perfil-by-id-query"
import { editPerfil } from "../../infra/remote"
import { EditPerfilSchema, editPerfilFormSchema } from "../validation/schema"

export function EditPerfilForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: perfil, isLoading } = usePerfilByIdQuery(id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditPerfilSchema>({
    resolver: zodResolver(editPerfilFormSchema),
    values: {
      nome: perfil?.nome || "",
      descricao: perfil?.descricao || "",
    },
  })

  async function onSubmit(data: Perfil.UpdateRequest) {
    try {
      await editPerfil(id, data)
      toast.success("Perfil editado com sucesso!")
      setTimeout(() => push("/perfis"), 2000)
    } catch (error) {
      toast.error("Erro ao editar Perfil: " + error)
    }
  }

  if (!perfil || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados do Perfil</h3>
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

          <div className="flex flex-col gap-2">
            <label htmlFor="isSistema">Sistema</label>
            <div className="flex h-10 items-center">
              <input
                type="checkbox"
                defaultChecked={perfil.isSistema}
                disabled
                className="h-5 w-5 cursor-not-allowed rounded border-gray-300 opacity-50"
              />
            </div>
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
          onClick={() => push("/perfis")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
