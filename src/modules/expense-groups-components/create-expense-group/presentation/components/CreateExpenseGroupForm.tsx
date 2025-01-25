"use client"

import { ExpenseGroup } from "@/@types/expense-group"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getCookie } from "@/lib/cookies"
import {
  CreateExpenseGroupSchema,
  createExpenseGroupSchema,
} from "@/modules/expense-groups-components/create-expense-group/presentation/validation/schema"
import { createExpenseGroup } from "@/modules/expense-groups-components/remote/expense-groups-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateExpenseGroupForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateExpenseGroupSchema>({
    resolver: zodResolver(createExpenseGroupSchema),
    values: {
      account_id: getCookie("accountId"),
    },
  })

  async function onSubmit(data: ExpenseGroup.CreateRequest) {
    try {
      const response = await createExpenseGroup(data)
      toast.success(response)
      setTimeout(() => push("/expense-groups"), 2000)
    } catch (error) {
      toast.error("Erro ao criar conta: " + error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input.Root>
          <Input.Control {...register("group_name")} type="text" />
        </Input.Root>
      </div>
      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/expense-groups")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
