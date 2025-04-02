"use client"

import { Budget } from "@/@types/budgets"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { createBudgetIncome } from "@/modules/budget-components/budget-income/create-budget-income/infra/remote/create-budget-income"
import {
  createBudgetIncomeFormSchema,
  CreateBudgetIncomeSchema,
} from "@/modules/budget-components/budget-income/create-budget-income/presentation/validation/schema"
import { useIncomeGroupQuery } from "@/modules/income-components/income-groups-components/remote/use-income-group-query"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateBudgetIncomeForm() {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const account_id = getAccountId()

  const budget_income_input_fields_description =
    permissions?.["budget_income_input_fields_description"]
  const budget_income_input_fields_amount =
    permissions?.["budget_income_input_fields_amount"]
  const budget_income_input_fields_date =
    permissions?.["budget_income_input_fields_date"]
  const budget_income_input_fields_income_group_id =
    permissions?.["budget_income_input_fields_income_group_id"]

  const { data: incomeGroups, isLoading } = useIncomeGroupQuery(account_id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
    getValues,
  } = useForm<CreateBudgetIncomeSchema>({
    resolver: zodResolver(createBudgetIncomeFormSchema),
    defaultValues: {
      data: [
        {
          description: "",
          amount: 0,
          account_id,
          date: new Date().toISOString().split("T")[0],
          income_group_id: "",
        },
      ],
      parts: 1,
    },
  })

  const { fields, append, remove } = useFieldArray<CreateBudgetIncomeSchema>({
    control,
    name: "data",
  })

  const watcherParts = watch("parts")

  async function onSubmit(data: { data: Budget.CreateIncome[] }) {
    try {
      const response = await createBudgetIncome(data)
      toast.success(response)
      setTimeout(() => push("/budget"), 2000)
    } catch (error) {
      toast.error("Erro ao criar previsão de receita: " + error)
    }
  }

  useEffect(() => {
    const currentLength = fields.length
    const newLength = Number(watcherParts)

    if (newLength > currentLength) {
      for (let i = currentLength; i < newLength; i++) {
        const lastDate =
          getValues().data[i - 1]?.date ?
            new Date(getValues().data[i - 1].date)
          : new Date()

        lastDate.setDate(lastDate.getDate() + 30)

        append({
          description: getValues().data[0]?.description,
          amount: getValues().data[0]?.amount || 0,
          account_id,
          date: lastDate.toISOString().split("T")[0],
          income_group_id: getValues().data[0]?.income_group_id || "",
        })
      }
    } else if (newLength < currentLength) {
      for (let i = currentLength - 1; i >= newLength; i--) {
        remove(i)
      }
    }
  }, [watcherParts, account_id])

  if (!incomeGroups || isLoading || permissionLoading) return <LoadingScreen />

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
              {...register(`data.${0}.description`, { required: true })}
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
            {...register(`data.${0}.income_group_id`, { required: true })}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="amount">Valor</label>
                  <Input.Root>
                    <Input.Currency
                      name={`data.${index}.amount`}
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
                      {...register(`data.${index}.date`, {
                        required: true,
                      })}
                      type="date"
                    />
                  </Input.Root>
                </div>
              </div>
            )
          })}
        </div>
        <SelectInput
          field_name="parts"
          label="Quantidade"
          options={Array.from({ length: 12 }, (_, index) => ({
            text: (index + 1).toString(),
            value: (index + 1).toString(),
          }))}
          {...register("parts", { required: true })}
          className="max-w-[90px]"
        />
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
