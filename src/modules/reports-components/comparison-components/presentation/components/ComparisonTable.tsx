"use client"

import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useComparisonDataQuery } from "@/modules/reports-components/comparison-components/infra/hooks/use-comparison-data-query"
import { ComparisonFilter } from "@/modules/reports-components/comparison-components/presentation/components/ComparisonFilter"
import { formatCurrency } from "@/modules/reports-components/dre-components/presentation/utils/dre-process-functions"
import { Fragment, useEffect, useState } from "react"

export function ComparisonTable() {
  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState({
    start_date: new Date(currentYear, 0, 1),
    end_date: new Date(currentYear, 11, 31),
  })
  const account_id = getAccountId()

  const {
    data: comparisonData,
    isLoading: isComparisonDataLoading,
    refetch,
  } = useComparisonDataQuery(account_id, filters)

  useEffect(() => {
    refetch()
  }, [filters])

  if (!comparisonData || isComparisonDataLoading) return <LoadingScreen />

  const renderTableSection = (
    title: string,
    data: any[],
    budgetData: any[],
    isIncome = true
  ) => {
    let totalActual = 0
    let totalBudget = 0

    return (
      <>
        <tr className="bg-gray-600 font-bold text-gray-200">
          <td className="px-3 py-2" colSpan={3}>
            {title}
          </td>
        </tr>
        {data.map(({ category, total, groups }) => {
          const budgetCategory = budgetData.find(
            (b) => b.category === category
          ) || { total: 0, groups: [] }
          totalActual += total
          totalBudget += budgetCategory.total

          return (
            <Fragment key={category}>
              <tr className="bg-gray-100 font-bold">
                <td className="px-3 py-2">{category}</td>
                <td className="px-3 py-2">{formatCurrency(total)}</td>
                <td className="px-3 py-2">
                  {formatCurrency(budgetCategory.total)}
                </td>
              </tr>
              {groups.map(({ group, incomes, expenses, total }) => {
                const budgetGroup =
                  budgetCategory.groups.find((g) => g.group === group) || {}
                const actualValue =
                  isIncome ? (incomes ?? total) : (expenses ?? total)
                const budgetValue =
                  isIncome ?
                    (budgetGroup.budget_incomes ?? 0)
                  : (budgetGroup.budget_expenses ?? 0)

                return (
                  <tr key={group + category}>
                    <td className="px-6 py-2 text-gray-700">{group}</td>
                    <td className="px-3 py-2">{formatCurrency(actualValue)}</td>
                    <td className="px-3 py-2">{formatCurrency(budgetValue)}</td>
                  </tr>
                )
              })}
            </Fragment>
          )
        })}
        <tr className="bg-gray-300 font-bold">
          <td className="px-3 py-2">Total {title}</td>
          <td className="px-3 py-2">{formatCurrency(totalActual)}</td>
          <td className="px-3 py-2">{formatCurrency(totalBudget)}</td>
        </tr>
      </>
    )
  }

  return (
    <div>
      <ComparisonFilter onFilterChange={setFilters} />
      <div className="my-8 flow-root max-w-[50rem]">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="overflow-hidden rounded-xl shadow ring-1 ring-black/5">
              <table className="w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left font-semibold text-gray-900">
                      Descrição
                    </th>
                    <th className="px-3 py-3.5 text-left font-semibold text-gray-900">
                      Realizado
                    </th>
                    <th className="px-3 py-3.5 text-left font-semibold text-gray-900">
                      Orçado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderTableSection(
                    "Receitas",
                    comparisonData.incomes,
                    comparisonData.budgetIncomes,
                    true
                  )}
                  {renderTableSection(
                    "Despesas",
                    comparisonData.expenses,
                    comparisonData.budgetExpenses,
                    false
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
