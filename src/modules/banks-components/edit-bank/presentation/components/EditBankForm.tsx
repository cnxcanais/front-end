"use client"

import { Bank } from "@/@types/banks"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getCookie } from "@/lib/cookies"
import {
  editBank,
  getBankById,
} from "@/modules/banks-components/edit-bank/infra/remote"
import {
  EditBankFormSchema,
  editBankSchema,
} from "@/modules/banks-components/edit-bank/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditBankForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: bank, isLoading } = useQuery({
    queryKey: ["bank", id],
    queryFn: () => getBankById(id),
    enabled: id !== "",
    refetchOnWindowFocus: false,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditBankFormSchema>({
    resolver: zodResolver(editBankSchema),
    values: {
      account_id: getCookie("accountId"),
      name: bank?.name || "",
      bank_number: bank?.bank_number || 0,
    },
  })

  async function onSubmit(data: Bank.UpdateRequest) {
    try {
      await editBank(id, data)
      toast.success("Banco editado com sucesso!")
      setTimeout(() => push("/banks"), 2000)
    } catch (error) {
      toast.error("Erro ao editar banco: " + error)
    }
  }

  if (!bank || isLoading) return <LoadingScreen />

  return (
    <form className="max-w-96" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root variant={errors.name ? "error" : "primary"}>
          <Input.Control {...register("name")} type="text" />
        </Input.Root>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <label htmlFor="bank_number">Número</label>
        <Input.Root variant={errors.bank_number ? "error" : "primary"}>
          <Input.Control {...register("bank_number")} type="text" />
        </Input.Root>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/banks")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
