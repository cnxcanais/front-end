"use client"

import { ExpenseGroup } from "@/@types/expense-group"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getAllExpenseCategories } from "@/modules/expenses-components/expense-categories-components/remote/expense-categories-methods"
import {
  CreateExpenseGroupSchema,
  createExpenseGroupSchema,
} from "@/modules/expenses-components/expense-groups-components/create-expense-group/presentation/validation/schema"
import { createExpenseGroup } from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateExpenseGroupForm() {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const account_id = getAccountId()

  const expense_group_input_fields_group_name =
    permissions?.["expense_group_input_fields_group_name"]
  const expense_group_input_fields_expense_category_id =
    permissions?.["expense_group_input_fields_expense_category_id"]

  const [expenseCategories, setExpenseCategories] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")

  const arrayConfigs: ArrayConfig<any>[] = [
    {
      fetchFn: getAllExpenseCategories,
      mapFn: (group) => ({
        label: group.name,
        value: group.expense_category_id,
      }),
      setState: setExpenseCategories,
    },
  ]

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CreateExpenseGroupSchema>({
    resolver: zodResolver(createExpenseGroupSchema),
    values: {
      account_id,
    },
  })

  async function onSubmit(data: ExpenseGroup.CreateRequest) {
    try {
      const response = await createExpenseGroup(data)
      toast.success(response)
      setTimeout(() => push("/expense-groups"), 2000)
    } catch (error) {
      toast.error("Erro ao criar item de despesas: " + error)
    }
  }

  useEffect(() => {
    populateArrays(
      arrayConfigs,
      account_id,
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control
            disabled={!expense_group_input_fields_group_name}
            {...register("group_name")}
            type="text"
          />
        </Input.Root>
        {errors.group_name && (
          <span className="text-xs text-red-500">
            {errors.group_name.message}
          </span>
        )}

        <div className="mt-8 flex max-w-96 flex-col gap-2">
          <label htmlFor="name">Grupo de Despesa</label>
          <Input.Root
            variant={errors.expense_category_id ? "error" : "primary"}>
            <Input.SelectInput
              name="expense_category_id"
              control={control}
              disabled={!expense_group_input_fields_expense_category_id}
              options={expenseCategories}
              placeholder={arrayPlaceHolder}
            />
          </Input.Root>
          {errors.expense_category_id && (
            <span className="text-xs text-red-500">
              {errors.expense_category_id.message}
            </span>
          )}
        </div>
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
