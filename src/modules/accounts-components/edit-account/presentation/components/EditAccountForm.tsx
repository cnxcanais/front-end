"use client"

import { Account } from "@/@types/accounts"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  editAccount,
  getAccountById,
} from "@/modules/accounts-components/edit-account/infra/remote"
import {
  editFormSchema,
  EditFormSchema,
} from "@/modules/accounts-components/edit-account/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditAccountForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: account, isLoading } = useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled: id !== "",
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditFormSchema>({
    resolver: zodResolver(editFormSchema),
    values: {
      account_id: id,
      name: account?.name || "",
      enabled: account?.enabled,
    },
  })

  async function onSubmit(data: Account.UpdateRequest) {
    try {
      await editAccount(data)
      toast.success("Conta editada com sucesso!")
      setTimeout(() => push("/accounts"), 2000)
    } catch (error) {
      toast.error("Erro ao editar conta: " + error)
    }
  }

  if (!account || isLoading) return <LoadingScreen />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control {...register("name")} type="text" />
        </Input.Root>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}

        <div className="mt-4 flex items-center gap-4">
          <Input.Control
            className="flex-none"
            {...register("enabled")}
            type="checkbox"
          />

          <label className="" htmlFor="enabled">
            Habilitada
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/accounts")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
