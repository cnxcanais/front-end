"use client"

import { Expense } from "@/@types/expense"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { editExpenseSchema } from "@/modules/expenses-components/expense-components/edit-expense/presentation/validation/schema"
import { useExpenseByIdQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-by-id-query"
import { editExpense } from "@/modules/expenses-components/expense-components/remote"
import { getAllExpenseGroups } from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { getSuppliers } from "@/modules/expenses-components/supplier-components/suppliers/infra/remote"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditExpenseForm({ expense_id }: { expense_id: string }) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const [organizations, setOrganizations] = useState<SearchArray>([])
  const [expenseGroups, setExpenseGroups] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [suppliers, setSuppliers] = useState<SearchArray>([])

  const { data: expense, isLoading } = useExpenseByIdQuery(expense_id)

  const arrayConfigs: ArrayConfig<any>[] = useMemo(
    () => [
      {
        fetchFn: getOrganizations,
        mapFn: (org) => ({
          label: org.name,
          value: org.organization_id,
        }),
        setState: setOrganizations,
      },
      {
        fetchFn: getAllExpenseGroups,
        mapFn: (group) => ({
          label: group.group_name,
          value: group.expense_group_id,
        }),
        setState: setExpenseGroups,
      },
      {
        fetchFn: getSuppliers,
        mapFn: (expense) => ({
          label: expense.name,
          value: expense.supplier_id,
        }),
        setState: setSuppliers,
      },
    ],
    []
  )

  useEffect(() => {
    if (!account_id) return

    populateArrays(
      arrayConfigs,
      account_id,
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [arrayConfigs, account_id])

  const expense_input_fields_amount = getPermissionByEntity(
    "expense_input_fields_amount"
  )
  const expense_input_fields_expense_qty = getPermissionByEntity(
    "expense_input_fields_expense_qty"
  )
  const expense_input_fields_expense_percentage = getPermissionByEntity(
    "expense_input_fields_expense_percentage"
  )
  const expense_input_fields_date = getPermissionByEntity(
    "expense_input_fields_date"
  )
  const expense_input_fields_document = getPermissionByEntity(
    "expense_input_fields_document"
  )
  const expense_input_fields_description = getPermissionByEntity(
    "expense_input_fields_description"
  )
  const expense_input_fields_supplier_id = getPermissionByEntity(
    "expense_input_fields_supplier_id"
  )
  const expense_input_fields_organization_id = getPermissionByEntity(
    "expense_input_fields_organization_id"
  )
  const expense_input_fields_expense_group_id = getPermissionByEntity(
    "expense_input_fields_expense_group_id"
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<Expense.UpdateRequest>({
    resolver: zodResolver(editExpenseSchema),
    values: {
      expense_percentage: Number(expense?.expense_percentage ?? 100),
      date: expense?.date.substring(0, 10),
      document: expense?.document,
      description: expense?.description,
      supplier_id: expense?.supplier_id,
      organization_id: expense?.organization_id,
      expense_group_id: expense?.expense_group_id,
      expense_id: expense?.expense_id,
      is_operational: expense?.is_operational,
      is_variable: expense?.is_variable,
    },
  })

  async function onSubmit(data: Expense.UpdateRequest) {
    try {
      await editExpense(data)
      toast.success("Despesa editada com sucesso!")
      setTimeout(() => push("/expenses"), 2000)
    } catch (error) {
      toast.error("Erro ao editar despesa: " + error)
    }
  }

  if (isLoading || !expense) return <LoadingScreen />

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label htmlFor="supplier_id">Gerador da Despesa</label>
              <Input.Root variant={errors.supplier_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="supplier_id"
                  control={control}
                  disabled={!expense_input_fields_supplier_id}
                  options={suppliers}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.supplier_id && (
                <span className="text-xs text-red-500">
                  {errors.supplier_id.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="expense_group_id">Grupo de Despesas</label>
              <Input.Root
                variant={errors.expense_group_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="expense_group_id"
                  control={control}
                  disabled={!expense_input_fields_expense_group_id}
                  options={expenseGroups}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.expense_group_id && (
                <span className="text-xs text-red-500">
                  {errors.expense_group_id.message}
                </span>
              )}
            </div>

            <div className="flex max-w-[150px] flex-1 flex-col gap-2">
              <label htmlFor="date">Data</label>
              <Input.Root variant={errors.date ? "error" : "primary"}>
                <Input.Control
                  disabled={!expense_input_fields_date}
                  {...register("date")}
                  type="date"
                />
              </Input.Root>
              {errors.date && (
                <span className="text-xs text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex min-w-[600px] flex-1 flex-col gap-2">
              <label htmlFor="description">Descrição</label>
              <Input.Root variant={errors.description ? "error" : "primary"}>
                <Input.Control
                  disabled={!expense_input_fields_description}
                  {...register("description")}
                  type="text"
                />
              </Input.Root>
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="document">NF/Recibo</label>
              <Input.Root variant={errors.document ? "error" : "primary"}>
                <Input.Control
                  disabled={!expense_input_fields_document}
                  {...register("document")}
                  type="text"
                />
              </Input.Root>
              {errors.document && (
                <span className="text-xs text-red-500">
                  {errors.document.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex max-w-[100px] flex-1 flex-col gap-2">
              <label htmlFor="expense_percentage">Percentual</label>
              <Input.Root
                variant={errors.expense_percentage ? "error" : "primary"}>
                <Input.Control
                  disabled={!expense_input_fields_expense_percentage}
                  {...register("expense_percentage")}
                  type="text"
                />
              </Input.Root>
              {errors.expense_percentage && (
                <span className="text-xs text-red-500">
                  {errors.expense_percentage.message}
                </span>
              )}
            </div>

            <div className="flex min-w-[400px] flex-col gap-2">
              <label htmlFor="cep">Organização</label>
              <Input.Root>
                <Input.SelectInput
                  name="organization_id"
                  control={control}
                  disabled={!expense_input_fields_organization_id}
                  options={organizations}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.organization_id && (
                <span className="text-xs text-red-500">
                  {errors.organization_id.message}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Input.Control
                className="flex-none"
                {...register("is_variable")}
                type="checkbox"
              />

              <label className="" htmlFor="enabled">
                Variável
              </label>
            </div>
            {errors.is_variable && (
              <span className="text-xs text-red-500">
                {errors.is_variable.message}
              </span>
            )}

            <div className="mt-4 flex items-center gap-4">
              <Input.Control
                className="flex-none"
                {...register("is_operational")}
                type="checkbox"
              />

              <label className="" htmlFor="enabled">
                Operacional
              </label>
            </div>
          </div>
          {errors.is_operational && (
            <span className="text-xs text-red-500">
              {errors.is_operational.message}
            </span>
          )}
        </div>

        <div className="my-2 flex gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Editar
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => push("/expenses")}
            variant="tertiary">
            Voltar
          </Button>
        </div>
      </form>
    </>
  )
}
