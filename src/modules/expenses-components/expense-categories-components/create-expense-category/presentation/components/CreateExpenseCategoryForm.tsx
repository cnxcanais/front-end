"use client"

import { ExpenseCategory } from "@/@types/expense-category"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import {
  CreateExpensecategorieschema,
  createExpenseCategorieSchema,
} from "@/modules/expenses-components/expense-categories-components/create-expense-category/presentation/validation/schema"
import { createExpenseCategory } from "@/modules/expenses-components/expense-categories-components/remote/expense-categories-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateExpenseCategoryForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateExpensecategorieschema>({
    resolver: zodResolver(createExpenseCategorieSchema),
    values: {
      account_id: getAccountId(),
    },
  })

  async function onSubmit(data: ExpenseCategory.CreateRequest) {
    try {
      const response = await createExpenseCategory(data)
      toast.success(response)
      setTimeout(() => push("/expense-categories"), 2000)
    } catch (error) {
      toast.error("Erro ao criar grupo: " + error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control {...register("name")} type="text" />
        </Input.Root>
      </div>
      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/expense-categories")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
