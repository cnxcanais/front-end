import { Budget } from "@/@types/budgets"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { useBudgetIncomesQuery } from "@/modules/budget-components/budget-income/budget-incomes/infra/hooks/use-budget-incomes-query"
import { useIncomeGroupQuery } from "@/modules/income-components/income-groups-components/remote/use-income-group-query"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface FilterProps {
  account_id: string
}

export function IncomeBudgetFilters({ account_id }: FilterProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [filters, setFilters] = useState<Budget.QueryParamsIncome>({})

  const { register, handleSubmit, control, reset } =
    useForm<Budget.QueryParamsIncome>()

  const { data: incomeGroups, isLoading } = useIncomeGroupQuery(account_id)

  const { refetch } = useBudgetIncomesQuery(account_id, filters)

  function onSubmit(data: Budget.QueryParamsIncome) {
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
      ...(data.min_amount === 0 || !data.min_amount ?
        { min_amount: undefined }
      : {}),
      ...(data.max_amount === 0 || !data.max_amount ?
        { max_amount: undefined }
      : {}),
    }

    setFilters(cleanedData)
  }

  function resetFilters() {
    reset()
    setFilters({})
  }

  useEffect(() => {
    refetch()
  }, [filters])

  if (isLoading || !incomeGroups) return <LoadingScreen fullScreen={false} />

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
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="min_amount">
                  Valor Inicial
                </label>
                <Input.Root>
                  <Input.Currency name="min_amount" control={control} />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="max_amount">
                  Valor Final
                </label>
                <Input.Root>
                  <Input.Currency name="max_amount" control={control} />
                </Input.Root>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4">
            <SelectInput
              className=""
              field_name="income_group_id"
              label="Grupo de Receita"
              options={incomeGroups.map((group) => ({
                text: group.group_name,
                value: group.income_group_id,
              }))}
              {...register("income_group_id")}
            />

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
