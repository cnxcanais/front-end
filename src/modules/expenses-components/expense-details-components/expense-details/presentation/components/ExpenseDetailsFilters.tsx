import { ExpenseDetails } from "@/@types/expense-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { prepareArrayForSelect } from "@/core/utils/prepare-array-for-select-input"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { useExpenseQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-query"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

interface FilterProps {
  onFilterChange: (filters: ExpenseDetails.QueryParams) => void
}

export function ExpenseDetailsFilters({ onFilterChange }: FilterProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isFilterFilled, setIsFilterFilled] = useState(false)
  const [isOverdue, setIsOverdue] = useState(false)

  const account_id = getAccountId()

  const { register, handleSubmit, control, reset, setValue } =
    useFormContext<ExpenseDetails.QueryParams>()

  const formValues = useWatch({ control })

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: expenses, isLoading: expensesIsLoading } =
    useExpenseQuery(account_id)

  function onSubmit(data: ExpenseDetails.QueryParams) {
    const adjustMonth = (month: string | undefined) => {
      if (!month) return undefined
      const [year, monthIndex, day] = month.split("-").map(Number)
      return new Date(year, monthIndex - 1, day)
    }

    const cleanedData = {
      ...data,
      bank_account_id:
        data.bank_account_id !== "" ? data.bank_account_id : undefined,
      start_date:
        isOverdue ? undefined : (
          adjustMonth(data.start_date)?.toISOString().split("T")[0]
        ),
      end_date:
        isOverdue ?
          new Date().toISOString().split("T")[0]
        : adjustMonth(data.end_date)?.toISOString().split("T")[0],
      ...(data.min_amount === 0 || !data.min_amount ?
        { min_amount: undefined }
      : {}),
      ...(data.max_amount === 0 || !data.max_amount ?
        { max_amount: undefined }
      : {}),
    }

    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    setValue("expense_id", "")
    onFilterChange({})
    if (window) {
      window.history.replaceState(
        {
          ...window.history.state,
          as: "/expense-details",
          url: "/expense-details",
        },
        "",
        "/expense-details"
      ) // remove query param but without refreshing the page
    }
  }

  useEffect(() => {
    const hasValue =
      Object.values(formValues).some(
        (value) => value !== undefined && value !== null && value !== ""
      ) || isOverdue

    setIsFilterFilled(hasValue)
  }, [formValues, isOverdue])

  if (!expenses || expensesIsLoading || !bankAccounts || bankAccountIsLoading)
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
                field_name="bank_account_id"
                label="Conta Bancária"
                options={bankAccounts.map((account) => ({
                  text: `AG: ${account.agency} CC: ${account.account_number}`,
                  value: account.bank_account_id,
                }))}
                {...register("bank_account_id")}
              />

              <div className="flex min-w-[200px] flex-col gap-2">
                <label htmlFor="expense_id">NF</label>
                <Input.Root>
                  <Input.SelectInput
                    name="expense_id"
                    control={control}
                    options={prepareArrayForSelect(
                      expenses?.expenses,
                      "document",
                      "expense_id"
                    )}
                    placeholder="Digite..."
                  />
                </Input.Root>
              </div>

              <SelectInput
                className="max-w-[150px]"
                field_name="expense_group_id"
                label="Pagamento"
                options={[
                  { text: "Pago", value: "true" },
                  { text: "Em Aberto", value: "false" },
                ]}
                {...register("is_paid")}
              />

              <div className="mt-4 flex items-center gap-4">
                <Input.Control
                  className="flex-none"
                  type="checkbox"
                  checked={isOverdue}
                  onChange={() => setIsOverdue(!isOverdue)}
                />

                <label className="" htmlFor="enabled">
                  Atrasados
                </label>
              </div>
            </div>

            <div className="flex h-12 w-full gap-2">
              <Button
                onClick={resetFilters}
                disabled={!isFilterFilled}
                className="w-full"
                variant="secondary"
                type="button">
                Limpar
              </Button>

              <Button
                disabled={!isFilterFilled}
                className="w-full"
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
