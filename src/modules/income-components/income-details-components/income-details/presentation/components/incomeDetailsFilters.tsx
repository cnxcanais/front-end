import { IncomeDetails } from "@/@types/income-details"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { prepareArrayForSelect } from "@/core/utils/prepare-array-for-select-input"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { useIncomeQuery } from "@/modules/income-components/income-components/infra/use-income-query"
import { getIncomeSources } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"

interface FilterProps {
  onFilterChange: (filters: IncomeDetails.QueryParams) => void
}

export function IncomeDetailsFilters({ onFilterChange }: FilterProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [isFilterFilled, setIsFilterFilled] = useState(false)
  const account_id = getAccountId()

  const { register, handleSubmit, control, reset, setValue } =
    useFormContext<IncomeDetails.QueryParams>()

  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [incomeSources, setIncomeSources] = useState<SearchArray>([])

  const arrayConfigs: ArrayConfig<any>[] = useMemo(
    () => [
      {
        fetchFn: getIncomeSources,
        mapFn: (income_source) => ({
          label: income_source.name,
          value: income_source.income_source_id,
        }),
        setState: setIncomeSources,
      },
    ],
    []
  )

  const formValues = useWatch({ control })

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: incomesData, isLoading: incomesIsLoading } =
    useIncomeQuery(account_id)

  function onSubmit(data: IncomeDetails.QueryParams) {
    const adjustMonth = (month: string | undefined) => {
      if (!month) return undefined
      const [year, monthIndex, day] = month.split("-").map(Number)
      return new Date(year, monthIndex - 1, day)
    }

    const cleanedData = {
      ...data,
      start_date: adjustMonth(data.start_date)?.toISOString().split("T")[0],
      end_date: adjustMonth(data.end_date)?.toISOString().split("T")[0],
      ...(data.income_source_id ?
        { income_source_id: data.income_source_id }
      : {}),
    }

    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    setValue("income_id", "")
    onFilterChange({})
    if (window) {
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
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    )

    setIsFilterFilled(hasValue)
  }, [formValues])

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

  if (!incomesData || incomesIsLoading || !bankAccounts || bankAccountIsLoading)
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
                  <Input.Control {...register("start_date")} type="date" />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="end_date">Data Final</label>
                <Input.Root>
                  <Input.Control {...register("end_date")} type="date" />
                </Input.Root>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="income_source_id">Cliente</label>
              <Input.Root>
                <Input.SelectInput
                  name="income_source_id"
                  control={control}
                  options={[{ label: "", value: "" }].concat(incomeSources)}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex gap-4">
              <SelectInput
                className="max-w-[200px]"
                field_name="income_group_id"
                label="Conta Bancária"
                options={bankAccounts.map((account) => ({
                  text: `AG: ${account.agency} CC: ${account.account_number}`,
                  value: account.bank_account_id,
                }))}
                {...register("bank_account_id")}
              />

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="income_id">NF</label>
                <Input.Root>
                  <Input.SelectInput
                    name="income_id"
                    control={control}
                    options={prepareArrayForSelect(
                      incomesData.incomes,
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
                  { text: "", value: undefined },
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
