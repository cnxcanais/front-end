"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseDetailsQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-query"
import { useIncomeDetailsQuery } from "@/modules/income-components/income-details-components/infra/hooks/use-income-details-query"
import {
  groupDataForCashflow,
  renderCashflowTableRows,
} from "@/modules/reports-components/cash-flow-components/utils/process-cash-flow-data"
import { FileXls } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { CashflowFilter } from "./CashflowFilter"

export function CashflowTable() {
  const currentYear = new Date().getFullYear()

  const [filters, setFilters] = useState({
    start_date: new Date(currentYear, 0, 1),
    end_date: new Date(currentYear, 11, 31),
  })

  const account_id = getAccountId()

  const {
    data: incomeDetailsData,
    isLoading: isIncomeDetailsLoading,
    refetch: refetchIncomeDetails,
  } = useIncomeDetailsQuery(account_id, filters)

  const {
    data: expenseDetailsData,
    isLoading: isExpenseDetailsLoading,
    refetch: refetchExpenseDetails,
  } = useExpenseDetailsQuery(account_id, filters)

  useEffect(() => {
    refetchIncomeDetails()
    refetchExpenseDetails()
  }, [filters])

  if (
    isIncomeDetailsLoading ||
    !incomeDetailsData ||
    !expenseDetailsData ||
    isExpenseDetailsLoading
  )
    return <LoadingScreen />

  const incomeCashflow = groupDataForCashflow(
    incomeDetailsData.incomeDetails,
    true,
    filters
  )
  const expenseCashflow = groupDataForCashflow(
    expenseDetailsData.expenseDetails,
    false,
    filters
  )

  return (
    <div className="">
      <CashflowFilter onFilterChange={(filters) => setFilters(filters)} />
      <div className="my-8 flow-root">
        <Button
          className="mb-2 flex items-center gap-1"
          variant="secondary"
          onClick={exportNoPagination}>
          <FileXls size={22} />
          Exportar
        </Button>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="w-full divide-y divide-gray-300" id="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Categoria / Grupo
                    </th>
                    {[
                      "Jan",
                      "Fev",
                      "Mar",
                      "Abr",
                      "Mai",
                      "Jun",
                      "Jul",
                      "Ago",
                      "Set",
                      "Out",
                      "Nov",
                      "Dez",
                    ]
                      .slice(
                        filters.start_date.getMonth(),
                        filters.end_date.getMonth() + 1
                      )
                      .map((month, i) => (
                        <th
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          key={i}>
                          {month}
                        </th>
                      ))}
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderCashflowTableRows(
                    incomeCashflow,
                    expenseCashflow,
                    filters
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
