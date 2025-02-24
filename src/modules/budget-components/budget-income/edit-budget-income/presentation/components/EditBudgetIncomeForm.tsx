"use client"

import { Budget } from "@/@types/budgets"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { useGetBudgetIncomeByIdQuery } from "@/modules/budget-components/budget-income/edit-budget-income/infra/hooks/use-get-budget-income-by-id-query"
import { editBudgetIncome } from "@/modules/budget-components/budget-income/edit-budget-income/infra/remote/edit-budget-income"
import {
  editBudgetIncomeFormSchema,
  EditBudgetIncomeSchema,
} from "@/modules/budget-components/budget-income/edit-budget-income/presentation/validation/schema"
import { useIncomeGroupQuery } from "@/modules/income-components/income-groups-components/remote/use-income-group-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditBudgetIncomeForm({ id }: { id: string }) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const budget_income_input_fields_description = getPermissionByEntity(
    "budget_income_input_fields_description"
  )
  const budget_income_input_fields_amount = getPermissionByEntity(
    "budget_income_input_fields_amount"
  )
  const budget_income_input_fields_date = getPermissionByEntity(
    "budget_income_input_fields_date"
  )
  const budget_income_input_fields_income_group_id = getPermissionByEntity(
    "budget_income_input_fields_income_group_id"
  )
  const { data: incomeGroups, isLoading } = useIncomeGroupQuery(account_id)
  const { data: budgetIncome } = useGetBudgetIncomeByIdQuery(id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<EditBudgetIncomeSchema>({
    resolver: zodResolver(editBudgetIncomeFormSchema),
    values: {
      budget_income_id: id,
      description: budgetIncome?.description,
      income_group_id: budgetIncome?.income_group_id,
      amount: budgetIncome?.amount,
      date:
        budgetIncome?.date ?
          new Date(budgetIncome.date).toISOString().split("T")[0]
        : "",
      account_id,
    },
  })

  async function onSubmit(data: Budget.UpdateIncome) {
    try {
      await editBudgetIncome(data)
      toast.success("Orçamento de receita atualizado com sucesso")
      setTimeout(() => push("/budget"), 2000)
    } catch (error) {
      toast.error("Erro ao editar orçamento de receita: " + error)
    }
  }

  if (!incomeGroups || !budgetIncome || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="description">Descrição</label>
          <Input.Root>
            <Input.Control
              disabled={!budget_income_input_fields_description}
              type="text"
              {...register("description")}
            />
          </Input.Root>
        </div>

        <div className="w-full max-w-[350px]">
          <SelectInput
            field_name="income_group_id"
            label="Item de Receita"
            options={incomeGroups.map((incomeGroup) => ({
              text: incomeGroup.group_name,
              value: incomeGroup.income_group_id,
            }))}
            disabled={!budget_income_input_fields_income_group_id}
            {...register("income_group_id")}
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
                  disabled={!budget_income_input_fields_amount}
                />
              </Input.Root>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="date">Data</label>
              <Input.Root>
                <Input.Control
                  disabled={!budget_income_input_fields_date}
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
          Editar
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
