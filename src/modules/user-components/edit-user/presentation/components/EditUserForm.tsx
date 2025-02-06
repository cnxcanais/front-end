"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { useGetUserByIdQuery } from "@/modules/user-components/edit-user/infra/hooks/use-get-user-by-id-query"
import { editUser } from "@/modules/user-components/edit-user/infra/remote"
import {
  EditUserSchema,
  editUserFormSchema,
} from "@/modules/user-components/edit-user/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditUserForm({ id }: { id: string }) {
  const { push } = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { data: user, isLoading } = useGetUserByIdQuery(id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditUserSchema>({
    resolver: zodResolver(editUserFormSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  })

  async function onSubmit(data: EditUserSchema) {
    try {
      await editUser({ user_id: id, ...data })
      toast.success("Usuário editado com sucesso!")
      setTimeout(() => push("/users"), 2000)
    } catch (error) {
      toast.error("Erro ao editar usuário: " + error)
    }
  }

  if (!user || isLoading) return <LoadingScreen />

  return (
    <form className="mt-6 max-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="name">
            Nome
          </label>
          <Input.Root>
            <Input.Control {...register("name")} type="text" />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="email">
            Email
          </label>
          <Input.Root>
            <Input.Control type="email" {...register("email")} />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="password">
            Senha
          </label>
          <Input.Root variant={errors.password ? "error" : "primary"}>
            <Input.Control
              {...register("password")}
              type={showPassword ? "text" : "password"}
            />
            <Input.Icon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ?
                <Eye className="h-5 w-5" />
              : <EyeSlash className="h-5 w-5" />}
            </Input.Icon>
          </Input.Root>
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/users")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
