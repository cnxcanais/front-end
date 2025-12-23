"use client"

import { Usuario } from "@/@types/usuario"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { usePerfilQuery } from "@/modules/perfis-components/perfis/infra/hooks/use-perfil-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUsuarioByIdQuery } from "../../infra/hooks/use-usuario-by-id-query"
import { editUsuario } from "../../infra/remote"
import { EditUsuarioSchema, editUsuarioFormSchema } from "../validation/schema"

export function EditUsuarioForm({ id }: { id: string }) {
  const { push } = useRouter()
  const { data: usuario, isLoading } = useUsuarioByIdQuery(id)
  const { data: corretoras } = useCorretoraQuery(1, 100)
  const { data: perfis } = usePerfilQuery()

  const corretorasOptions = useMemo(() => {
    if (!corretoras?.data) return []
    return corretoras.data.map((c) => ({
      text: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const perfisOptions = useMemo(() => {
    if (!perfis) return []
    return perfis.data.map((p) => ({
      text: p.nome,
      value: p.id,
    }))
  }, [perfis])

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditUsuarioSchema>({
    resolver: zodResolver(editUsuarioFormSchema),
    values: {
      nome: usuario?.nome || "",
      perfilId: usuario?.perfilId || "",
      corretoraId: usuario?.corretoraId || "",
    },
  })

  async function onSubmit(data: Usuario.UpdateRequest) {
    try {
      await editUsuario(id, data)
      toast.success("Usuário editado com sucesso!")
      setTimeout(() => push("/usuarios"), 2000)
    } catch (error) {
      toast.error("Erro ao editar usuário: " + error)
    }
  }

  if (!usuario || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados do Usuário</h3>
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
            <label htmlFor="email">Email</label>
            <Input.Root variant="disabled">
              <Input.Control value={usuario.email} disabled type="email" />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={perfisOptions}
              label="Perfil"
              field_name="perfilId"
              {...register("perfilId")}
            />
            {errors.perfilId && (
              <span className="text-xs text-red-500">
                {errors.perfilId.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={corretorasOptions}
              label="Corretora"
              field_name="corretoraId"
              {...register("corretoraId")}
            />
            {errors.corretoraId && (
              <span className="text-xs text-red-500">
                {errors.corretoraId.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="isMaster">Master</label>
            <div className="flex h-10 items-center">
              <input
                type="checkbox"
                defaultChecked={usuario.isMaster}
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
          onClick={() => push("/usuarios")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
