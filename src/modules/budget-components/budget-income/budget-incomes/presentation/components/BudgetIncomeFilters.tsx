import { Budget } from "@/@types/budgets"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { useBudgetIncomesQuery } from "@/modules/budget-components/budget-income/budget-incomes/infra/hooks/use-budget-incomes-query"
import { useIncomeGroupQuery } from "@/modules/income-components/income-groups-components/remote/use-income-group-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface FilterProps {
  account_id: string
}

export function IncomeBudgetFilters({ account_id }: FilterProps) {
  const { register, handleSubmit, control, getValues, watch, reset } =
    useForm<Budget.QueryParamsIncome>({})

  const [filters, setFilters] = useState<Budget.QueryParamsIncome>({})

  const { data: incomeGroups, isLoading } = useIncomeGroupQuery(account_id)

  const { refetch } = useBudgetIncomesQuery(account_id, getValues())

  function onSubmit(data: Budget.QueryParamsIncome) {
    const cleanedData = {
      ...data,
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-black bg-gray-100 p-3">
        <h1 className="mb-2 text-xl font-semibold">Filtros</h1>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="start_date">
                  Data Inicial
                </label>
                <Input.Root>
                  <Input.Control {...register("start_date")} type="date" />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-lg" htmlFor="end_date">
                  Data Final
                </label>
                <Input.Root>
                  <Input.Control {...register("end_date")} type="date" />
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

              <div className="flex flex-col gap-2">
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
