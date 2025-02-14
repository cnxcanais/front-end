"use client"

import { ExpenseGroup } from "@/@types/expense-group"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  editExpenseGroupFormSchema,
  EditExpenseGroupFormSchema,
} from "@/modules/expenses-components/expense-groups-components/edit-expense-group/presentation/validation/schema"
import {
  getExpenseGroupById,
  updateExpenseGroup,
} from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditExpenseGroupForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: expenseGroup, isLoading } = useQuery({
    queryKey: ["expense-group", id],
    queryFn: () => getExpenseGroupById(id),
    enabled: id !== "",
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditExpenseGroupFormSchema>({
    resolver: zodResolver(editExpenseGroupFormSchema),
    values: {
      group_name: expenseGroup?.group_name,
    },
  })

  async function onSubmit(data: ExpenseGroup.UpdateRequest) {
    try {
      await updateExpenseGroup(id, data)
      toast.success("Grupo de despesa editado com sucesso!")
      setTimeout(() => push("/expense-groups"), 2000)
    } catch (error) {
      toast.error("Erro ao editar grupo de despesa: " + error)
    }
  }

  if (!expenseGroup || isLoading) return <LoadingScreen />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control {...register("group_name")} type="text" />
        </Input.Root>
        {errors.group_name && (
          <span className="text-xs text-red-500">
            {errors.group_name.message}
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Button disabled={isSubmitting} onClick={() => {}} variant="secondary">
          Editar
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          onClick={() => push("/accounts")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
