"use client"

import { User } from "@/@types/users"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { useGetAccountsQuery } from "@/modules/accounts-components/accounts/infra/hooks/use-get-accounts-query"
import { useGetProfilesQuery } from "@/modules/profiles-components/profiles/infra/hooks/use-get-profiles-query"
import { createUser } from "@/modules/user-components/create-user/infra/remote/create-user"
import {
  CreateUserSchema,
  createUserFormSchema,
} from "@/modules/user-components/create-user/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateUserForm() {
  const { push } = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const account_id = getAccountId()

  const { data: profiles, isLoading: isProfilesLoading } =
    useGetProfilesQuery(account_id)
  const { data: accounts, isLoading: isAccountsLoading } = useGetAccountsQuery()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      account_id,
    },
  })

  async function onSubmit(data: User.CreateRequest) {
    try {
      const response = await createUser(data)
      toast.success(response)
      setTimeout(() => push("/users"), 2000)
    } catch (error) {
      toast.error("Erro ao criar usuario: " + error)
    }
  }

  if (isProfilesLoading || isAccountsLoading || !profiles || !accounts)
    return <LoadingScreen />

  return (
    <form
      className="mt-6 grid w-full max-w-[1000px] grid-flow-row grid-cols-2 gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Nome</label>
          <Input.Root variant={errors.name ? "error" : "primary"}>
            <Input.Control {...register("name")} type="text" />
          </Input.Root>
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <Input.Root variant={errors.email ? "error" : "primary"}>
            <Input.Control {...register("email")} type="email" />
          </Input.Root>
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password">Senha</label>
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

      <div className="flex flex-col gap-4">
        <SelectInput
          field_name="profile_id"
          label="Perfil de Acesso"
          options={profiles.map((profile) => {
            return {
              text: profile.name,
              value: profile.profile_id,
            }
          })}
          {...register("profile_id")}
        />

        <SelectInput
          field_name="account_id"
          label="Conta Associada"
          options={accounts.map((account) => {
            return {
              text: account.name,
              value: account.account_id,
            }
          })}
          {...register("account_id")}
        />
      </div>

      <div className="my-2 flex gap-4">
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
