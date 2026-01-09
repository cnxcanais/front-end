"use client"

import { Usuario } from "@/@types/usuario"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { usePerfilQuery } from "@/modules/perfis-components/perfis/infra/hooks/use-perfil-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createUsuario } from "../../infra/remote/create-usuario"
import {
  CreateUsuarioSchema,
  createUsuarioFormSchema,
} from "../validation/schema"

export function CreateUsuarioForm() {
  const { push } = useRouter()
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
  } = useForm<CreateUsuarioSchema>({
    resolver: zodResolver(createUsuarioFormSchema),
  })

  async function onSubmit(data: Usuario.CreateRequest) {
    try {
      await createUsuario(data)
      toast.success("Usuário criado com sucesso!")
      setTimeout(() => push("/usuarios"), 2000)
    } catch (error) {
      toast.error("Erro ao criar usuário: " + error)
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados do Usuário</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="nome">Nome *</label>
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
            <label htmlFor="email">Email *</label>
            <Input.Root variant={errors.email ? "error" : "primary"}>
              <Input.Control {...register("email")} type="email" />
            </Input.Root>
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={perfisOptions}
              label="Perfil *"
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
                {...register("isMaster")}
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-gray-300"
              />
            </div>
            {errors.isMaster && (
              <span className="text-xs text-red-500">
                {errors.isMaster.message}
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
          onClick={() => push("/usuarios")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
