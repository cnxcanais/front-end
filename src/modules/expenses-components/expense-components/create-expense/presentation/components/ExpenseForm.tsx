"use client"

import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { usePermissions } from "@/core/utils/hooks/use-permission"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { FormType } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/CreateExpenseForm"
import { getAllExpenseGroups } from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { getSuppliers } from "@/modules/expenses-components/supplier-components/suppliers/infra/remote"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  account_id: string
  setSecondPage: Dispatch<SetStateAction<boolean>>
}

export function ExpenseForm({ account_id, setSecondPage }: Props) {
  const { push } = useRouter()

  const {
    register,
    trigger,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<FormType>()

  const [organizations, setOrganizations] = useState<SearchArray>([])
  const [expenseGroups, setExpenseGroups] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [suppliers, setSuppliers] = useState<SearchArray>([])

  const [isTax, setIsTax] = useState(false)

  const isOverIncome = watch("is_over_income")
  const isOverProfit = watch("is_over_profit")

  const arrayConfigs: ArrayConfig<any>[] = [
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
  ]

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

  // reset properties if isTax is turned to false again
  useEffect(() => {
    if (!isTax) {
      setValue("is_over_income", false)
      setValue("is_over_profit", false)
      setValue("execution_date", undefined)
    }
  }, [isTax])

  const permissions = [
    "expense_input_fields_expense_percentage",
    "expense_input_fields_date",
    "expense_input_fields_document",
    "expense_input_fields_description",
    "expense_input_fields_supplier_id",
    "expense_input_fields_organization_id",
    "expense_input_fields_expense_group_id",
  ]

  const {
    expense_input_fields_expense_percentage,
    expense_input_fields_date,
    expense_input_fields_document,
    expense_input_fields_description,
    expense_input_fields_supplier_id,
    expense_input_fields_organization_id,
    expense_input_fields_expense_group_id,
  } = usePermissions(permissions)

  return (
    <>
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
            <label htmlFor="expense_group_id">Item de Despesas</label>
            <Input.Root variant={errors.expense_group_id ? "error" : "primary"}>
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
          <div className="flex flex-1 flex-col gap-2">
            <label className="min-w-[600px]" htmlFor="description">
              Descrição
            </label>
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

      <div className="mt-4 flex gap-4">
        <div className="flex max-w-[100px] flex-1 flex-col gap-2">
          <label htmlFor="expense_percentage">Percentual</label>
          <Input.Root variant={errors.expense_percentage ? "error" : "primary"}>
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

      <div className="mt-4 flex flex-col gap-2">
        <div className="mt-4 flex items-center gap-4">
          <Input.Control
            className="flex-none"
            type="checkbox"
            checked={isTax}
            onChange={() => setIsTax(!isTax)}
          />

          <label className="" htmlFor="enabled">
            É Imposto?
          </label>
        </div>

        {isTax ?
          <div className="flex">
            <div className="flex gap-4 rounded-lg border border-gray-500 p-2.5">
              <div className="mt-4 flex items-center gap-4">
                <Input.Control
                  {...register("is_over_profit")}
                  className="flex-none"
                  type="checkbox"
                  onChange={() => {
                    setValue("is_over_profit", !isOverProfit)
                    if (!isOverProfit) {
                      setValue("is_over_income", false)
                    }
                  }}
                />

                <label htmlFor="is_over_profit">Sobre Lucro</label>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Input.Control
                  {...register("is_over_income")}
                  className="flex-none"
                  type="checkbox"
                  onChange={() => {
                    setValue("is_over_income", !isOverIncome)
                    if (!isOverIncome) {
                      setValue("is_over_profit", false)
                    }
                  }}
                />

                <label htmlFor="is_over_income">Sobre Receita</label>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="execution_date">Data Compensação</label>
                <Input.Root variant={"primary"}>
                  <Input.Control {...register("execution_date")} type="date" />
                </Input.Root>
              </div>
            </div>
          </div>
        : null}
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          variant="primary"
          type="button"
          onClick={async () => {
            const isFormValid = await trigger([
              "supplier_id",
              "expense_group_id",
              "date",
              "description",
              "document",
              "expense_percentage",
              "organization_id",
            ])

            if (isFormValid) {
              setSecondPage(true)
            } else {
              toast.error("Preencha todos os campos obrigatórios")
            }
          }}>
          Avançar
        </Button>
        <Button
          type="button"
          onClick={() => push("/expenses")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </>
  )
}
