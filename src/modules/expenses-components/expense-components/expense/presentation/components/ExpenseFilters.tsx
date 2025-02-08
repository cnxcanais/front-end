import { Expense } from "@/@types/expense"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { prepareArrayForSelect } from "@/core/utils/prepare-array-for-select-input"
import { useExpenseQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-query"
import { useExpenseGroupQuery } from "@/modules/expenses-components/expense-groups-components/remote/use-expense-groups-query"
import { useSupplierQuery } from "@/modules/expenses-components/supplier-components/suppliers/infra/hooks/use-supplier-query"
import { useOrganizationsQuery } from "@/modules/organization-components/organizations/infra/remote/hooks/use-organizations-query"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface FilterProps {
  account_id: string
}

export function ExpenseFilters({ account_id }: FilterProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [filters, setFilters] = useState<Expense.GetRequest>(
    {} as Expense.GetRequest
  )

  const { register, handleSubmit, control, reset } =
    useForm<Expense.GetRequest>()

  const { data: expenses, isLoading: expensesIsLoading } =
    useExpenseQuery(account_id)

  const { data: expenseGroups, isLoading: expenseGroupsIsLoading } =
    useExpenseGroupQuery(account_id)

  const { data: expenseSources, isLoading: expenseSourcesIsLoading } =
    useSupplierQuery(account_id)

  const { data: organizations, isLoading: organizationsIsLoading } =
    useOrganizationsQuery(account_id)

  const { refetch } = useExpenseQuery(account_id, filters)

  function onSubmit(data: Expense.GetRequest) {
    const adjustMonth = (month: string | undefined, isStart: boolean) => {
      if (!month) return undefined
      const [year, monthIndex] = month.split("-").map(Number)
      return isStart ?
          new Date(year, monthIndex - 1, 1)
        : new Date(year, monthIndex, 0)
    }

    const cleanedData = {
      ...data,
      start_date: adjustMonth(data.start_date, true)
        ?.toISOString()
        .split("T")[0],
      end_date: adjustMonth(data.end_date, false)?.toISOString().split("T")[0],

      page: 1,
    }

    setFilters(cleanedData)
  }

  function resetFilters() {
    reset()
    setFilters({} as Expense.GetRequest)
  }

  useEffect(() => {
    refetch()
  }, [filters])

  if (
    !expenses ||
    expensesIsLoading ||
    !expenseGroups ||
    expenseGroupsIsLoading ||
    !expenseSources ||
    expenseSourcesIsLoading ||
    !organizations ||
    organizationsIsLoading
  )
    return <LoadingScreen fullScreen={false} />

  return (
    <div className="">
      <div className="my-2 flex gap-4" onClick={() => setCollapsed(!collapsed)}>
        <h1 className="mb-2 text-xl font-semibold">Filtros</h1>
        {collapsed ?
          <CaretRight className="h-7 w-7 cursor-pointer" />
        : <CaretDown className="h-7 w-7 cursor-pointer" />}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex-1 rounded-lg border border-black bg-gray-100 p-3 ${collapsed ? "invisible hidden" : ""}`}>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="start_date">
                  Data Inicial
                </label>
                <Input.Root>
                  <Input.Control {...register("start_date")} type="month" />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="end_date">
                  Data Final
                </label>
                <Input.Root>
                  <Input.Control {...register("end_date")} type="month" />
                </Input.Root>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex min-w-[250px] flex-col gap-2">
                <label className="text-lg" htmlFor="expense_id">
                  Grupo de Receita
                </label>
                <Input.Root>
                  <Input.SelectInput
                    name="expense_group_id"
                    control={control}
                    options={prepareArrayForSelect(
                      expenseGroups,
                      "group_name",
                      "expense_group_id"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>

              <div className="flex min-w-[250px] flex-col gap-2">
                <label className="text-lg" htmlFor="expense_id">
                  Cliente
                </label>
                <Input.Root>
                  <Input.SelectInput
                    name="expenseSourceId"
                    control={control}
                    options={prepareArrayForSelect(
                      expenseSources,
                      "name",
                      "supplier_id"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex min-w-[200px] flex-col gap-2">
                <label className="text-lg" htmlFor="expense_id">
                  NF
                </label>
                <Input.Root>
                  <Input.SelectInput
                    name="document"
                    control={control}
                    options={prepareArrayForSelect(
                      expenses.expenses,
                      "document",
                      "document"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>

              <div className="flex min-w-[200px] flex-col gap-2">
                <label className="text-lg" htmlFor="expense_id">
                  Organização
                </label>
                <Input.Root>
                  <Input.SelectInput
                    name="organization_id"
                    control={control}
                    options={prepareArrayForSelect(
                      organizations,
                      "name",
                      "organization_id"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>
            </div>

            <div className="flex h-12 w-full gap-2">
              {Object.values(filters).length > 0 && (
                <Button
                  onClick={resetFilters}
                  className="w-full"
                  variant="secondary"
                  type="button">
                  Limpar
                </Button>
              )}
              <Button className="w-full" variant="secondary" type="submit">
                Pesquisar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
