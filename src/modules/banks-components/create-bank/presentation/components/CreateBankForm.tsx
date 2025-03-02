"use client"

import { Bank } from "@/@types/banks"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { createBank } from "@/modules/banks-components/create-bank/infra/remote/create-bank"
import {
  CreateBankFormSchema,
  createBankSchema,
} from "@/modules/banks-components/create-bank/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateBankForm() {
  const { push } = useRouter()

  const account_id = getAccountId()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateBankFormSchema>({
    resolver: zodResolver(createBankSchema),
    values: {
      account_id,
    },
  })

  async function onSubmit(data: Bank.CreateRequest) {
    try {
      const response = await createBank(data)
      toast.success(response)
      setTimeout(() => push("/banks"), 2000)
    } catch (error) {
      toast.error("Erro ao criar banco: " + error)
    }
  }

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
      <div className="mt-6 flex gap-4">
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
