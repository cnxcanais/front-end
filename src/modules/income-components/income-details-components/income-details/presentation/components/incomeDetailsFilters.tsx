import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { prepareArrayForSelect } from "@/core/utils/prepare-array-for-select-input"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { useIncomeQuery } from "@/modules/income-components/income-components/infra/use-income-query"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

interface FilterProps {
  onFilterChange: (filters: IncomeDetails.QueryParams) => void
}

export function IncomeDetailsFilters({ onFilterChange }: FilterProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [isFilterFilled, setIsFilterFilled] = useState(false)
  const account_id = getAccountId()

  const { register, handleSubmit, control, reset, setValue } =
    useFormContext<IncomeDetails.QueryParams>()

  const formValues = useWatch({ control })

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: incomes, isLoading: incomesIsLoading } =
    useIncomeQuery(account_id)

  function onSubmit(data: IncomeDetails.QueryParams) {
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
      page: 1,
    }

    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    setValue("income_id", "")
    onFilterChange({})
    window.history.replaceState(
      {
        ...window.history.state,
        as: "/income-details",
        url: "/income-details",
      },
      "",
      "/income-details"
    ) // remove query param but without refreshing the page
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    )

    setIsFilterFilled(hasValue)
  }, [formValues])

  if (!incomes || incomesIsLoading || !bankAccounts || bankAccountIsLoading)
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
                <label htmlFor="start_date">Data Inicial</label>
                <Input.Root>
                  <Input.Control {...register("start_date")} type="month" />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="end_date">Data Final</label>
                <Input.Root>
                  <Input.Control {...register("end_date")} type="month" />
                </Input.Root>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="min_amount">Valor Inicial</label>
                <Input.Root>
                  <Input.Currency name="min_amount" control={control} />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="max_amount">Valor Final</label>
                <Input.Root>
                  <Input.Currency name="max_amount" control={control} />
                </Input.Root>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex gap-4">
              <SelectInput
                className="max-w-[200px]"
                field_name="income_group_id"
                label="Conta Bancária"
                options={[{ text: "", value: "" }].concat(
                  bankAccounts.map((account) => ({
                    text: `AG: ${account.agency} CC: ${account.account_number}`,
                    value: account.bank_account_id,
                  }))
                )}
                {...register("bank_account_id")}
              />

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="income_id">NF</label>
                <Input.Root>
                  <Input.SelectInput
                    name="income_id"
                    control={control}
                    options={prepareArrayForSelect(
                      incomes,
                      "document",
                      "income_id"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>

              <SelectInput
                className="max-w-[100px]"
                field_name="income_group_id"
                label="Pagamento"
                options={[
                  { text: "", value: "" },
                  { text: "Pago", value: "true" },
                  { text: "Em Aberto", value: "false" },
                ]}
                {...register("is_paid")}
              />
            </div>

            <div className="flex h-12 w-full gap-2">
              <Button
                className="w-full"
                disabled={!isFilterFilled}
                onClick={resetFilters}
                variant="secondary"
                type="button">
                Limpar
              </Button>

              <Button
                className="w-full"
                disabled={!isFilterFilled}
                variant="secondary"
                type="submit">
                Pesquisar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
