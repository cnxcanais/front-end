"use client"

import { ExpenseCategory } from "@/@types/expense-category"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  editExpenseCategoryFormSchema,
  EditExpenseCategoryFormSchema,
} from "@/modules/expenses-components/expense-categories-components/edit-expense-category/presentation/validation/schema"
import {
  getExpenseCategoryById,
  updateExpenseCategory,
} from "@/modules/expenses-components/expense-categories-components/remote/expense-categories-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditExpenseCategoryForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: expenseCategory, isLoading } = useQuery({
    queryKey: ["expense-category", id],
    queryFn: () => getExpenseCategoryById(id),
    enabled: id !== "",
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditExpenseCategoryFormSchema>({
    resolver: zodResolver(editExpenseCategoryFormSchema),
    values: {
      name: expenseCategory?.name,
    },
  })

  async function onSubmit(data: ExpenseCategory.UpdateRequest) {
    try {
      await updateExpenseCategory(id, data)
      toast.success("Grupo editado com sucesso!")
      setTimeout(() => push("/expense-categories"), 2000)
    } catch (error) {
      toast.error("Erro ao editar grupo: " + error)
    }
  }

  if (!expenseCategory || isLoading) return <LoadingScreen />

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
      </div>

      <div className="mt-6 flex gap-4">
        <Button disabled={isSubmitting} onClick={() => {}} variant="secondary">
          Editar
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          onClick={() => push("/expense-categories")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
