"use client"

import { Budget } from "@/@types/budgets"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { useGetBudgetExpenseByIdQuery } from "@/modules/budget-components/budget-expense/edit-budget-expense/infra/hooks/use-get-budget-expense-by-id-query"
import { editBudgetExpense } from "@/modules/budget-components/budget-expense/edit-budget-expense/infra/remote/edit-budget-expense"
import {
  editBudgetExpenseFormSchema,
  EditBudgetExpenseSchema,
} from "@/modules/budget-components/budget-expense/edit-budget-expense/presentation/validation/schema"
import { useExpenseGroupQuery } from "@/modules/expenses-components/expense-groups-components/remote/use-expense-groups-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditBudgetExpenseForm({ id }: { id: string }) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const budget_expense_input_fields_description = getPermissionByEntity(
    "budget_expense_input_fields_description"
  )
  const budget_expense_input_fields_amount = getPermissionByEntity(
    "budget_expense_input_fields_amount"
  )
  const budget_expense_input_fields_date = getPermissionByEntity(
    "budget_expense_input_fields_date"
  )
  const budget_expense_input_fields_expense_group_id = getPermissionByEntity(
    "budget_expense_input_fields_expense_group_id"
  )

  const { data: expenseGroups, isLoading } = useExpenseGroupQuery(account_id)
  const { data: budgetExpense } = useGetBudgetExpenseByIdQuery(id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<EditBudgetExpenseSchema>({
    resolver: zodResolver(editBudgetExpenseFormSchema),
    values: {
      budget_expense_id: id,
      description: budgetExpense?.description,
      expense_group_id: budgetExpense?.expense_group_id,
      amount: budgetExpense?.amount,
      date:
        budgetExpense?.date ?
          new Date(budgetExpense.date).toISOString().split("T")[0]
        : "",
      account_id,
    },
  })

  async function onSubmit(data: Budget.UpdateExpense) {
    try {
      await editBudgetExpense(data)
      toast.success("Orçamento de despesa atualizado com sucesso")
      setTimeout(() => push("/budget"), 2000)
    } catch (error) {
      toast.error("Erro ao editar orçamento de despesa: " + error)
    }
  }

  if (!expenseGroups || !budgetExpense || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="description">Descrição</label>
          <Input.Root>
            <Input.Control
              disabled={!budget_expense_input_fields_description}
              type="text"
              {...register("description")}
            />
          </Input.Root>
        </div>

        <div className="w-full max-w-[350px]">
          <SelectInput
            field_name="expense_group_id"
            label="Grupo de Despesa"
            options={expenseGroups.map((expenseGroup) => ({
              text: expenseGroup.group_name,
              value: expenseGroup.expense_group_id,
            }))}
            disabled={!budget_expense_input_fields_expense_group_id}
            {...register("expense_group_id")}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="amount">Valor</label>
              <Input.Root>
                <Input.Currency
                  name={"amount"}
                  control={control}
                  disabled={!budget_expense_input_fields_amount}
                />
              </Input.Root>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="date">Data</label>
              <Input.Root>
                <Input.Control
                  disabled={!budget_expense_input_fields_date}
                  {...register("date")}
                  type="date"
                />
              </Input.Root>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/budget")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
