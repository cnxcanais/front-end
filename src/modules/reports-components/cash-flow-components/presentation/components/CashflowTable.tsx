"use client"

import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseDetailsQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-query"
import { useIncomeDetailsQuery } from "@/modules/income-components/income-details-components/infra/hooks/use-income-details-query"
import { useState } from "react"
import {
  groupDataForCashflow,
  renderCashflowTable,
  ViewMode,
} from "../../utils/process-cash-flow-data"

const filter = { startMonth: 0, endMonth: 11 }

const filterParams = {
  start_date: new Date("2025-01-01"),
  end_date: new Date("2025-12-31"),
}

export function CashflowTable() {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly")

  const account_id = getAccountId()

  const { data: incomeDetailsData, isLoading: isIncomeDetailsLoading } =
    useIncomeDetailsQuery(account_id, filterParams)

  const { data: expenseDetailsData, isLoading: isExpenseDetailsLoading } =
    useExpenseDetailsQuery(account_id, filterParams)

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
    viewMode,
    filter
  )
  const expenseCashflow = groupDataForCashflow(
    expenseDetailsData.expenseDetails,
    false,
    viewMode,
    filter
  )

  return (
    <div className="">
      <div className="my-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Categoria / Grupo
                    </th>
                    {viewMode === "monthly" &&
                      [
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
                        "Total",
                      ].map((month, i) => (
                        <th
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          key={i}>
                          {month}
                        </th>
                      ))}
                    {viewMode === "quarterly" &&
                      ["T1", "T2", "T3", "T4", "Total"].map((q, i) => (
                        <th key={i}>{q}</th>
                      ))}
                    {viewMode === "yearly" && <th>Total Anual</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderCashflowTable(
                    incomeCashflow,
                    "Receitas",
                    viewMode,
                    filter
                  )}
                  {renderCashflowTable(
                    expenseCashflow,
                    "Despesas",
                    viewMode,
                    filter
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
