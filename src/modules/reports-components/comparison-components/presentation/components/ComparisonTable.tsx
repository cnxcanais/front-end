"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { formatCurrency } from "@/core/utils/format-currency"
import { getAccountId } from "@/core/utils/get-account-id"
import { useComparisonDataQuery } from "@/modules/reports-components/comparison-components/infra/hooks/use-comparison-data-query"
import { ComparisonFilter } from "@/modules/reports-components/comparison-components/presentation/components/ComparisonFilter"
import { FileXls } from "@phosphor-icons/react"
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
    isIncome: boolean = true
  ) => {
    let totalActual = 0
    let totalBudget = 0

    return (
      <>
        {data.map(({ category, total, groups }) => {
          const budgetCategory = budgetData.find(
            (b) => b.category === category
          ) || { total: 0, groups: [] }
          totalActual += total
          totalBudget += budgetCategory.total
          const delta = total - budgetCategory.total

          return (
            <Fragment key={category}>
              <tr className="bg-gray-50 font-medium text-gray-900">
                <td className="px-3 py-2 text-sm">{category}</td>
                <td className="px-3 py-2 text-sm">
                  {formatCurrency(budgetCategory.total)}
                </td>
                <td className="px-3 py-2 text-sm">{formatCurrency(total)}</td>
                <td
                  className={`px-3 py-2 text-sm ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(delta)}
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
                const groupDelta = actualValue - budgetValue

                return (
                  <tr
                    key={group + category}
                    className="text-gray-600 hover:bg-gray-50">
                    <td className="w-52 px-3 py-1.5 pl-10 text-sm">{group}</td>

                    <td className="w-20 px-3 py-1.5 text-sm">
                      {formatCurrency(budgetValue)}
                    </td>
                    <td className="w-20 px-3 py-1.5 text-sm">
                      {formatCurrency(actualValue)}
                    </td>
                    <td
                      className={`w-20 px-3 py-1.5 text-sm ${groupDelta >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(groupDelta)}
                    </td>
                  </tr>
                )
              })}
            </Fragment>
          )
        })}
        <tr className="bg-gray-200 text-sm font-bold text-gray-700">
          <td className="px-3 py-2">Total {title}</td>
          <td className="px-3 py-2">{formatCurrency(totalBudget)}</td>
          <td className="px-3 py-2">{formatCurrency(totalActual)}</td>
          <td
            className={`px-3 py-2 ${totalActual - totalBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(totalActual - totalBudget)}
          </td>
        </tr>
      </>
    )
  }

  return (
    <div>
      <ComparisonFilter onFilterChange={setFilters} />
      <div className="my-8 flow-root max-w-[40rem]">
        <div className="flex items-center gap-2">
          <ExportTableToPDFButton
            filename="meu-relatorio"
            options={{ orientation: "portrait" }}
            className="bg-red-500">
            Exportar PDF
          </ExportTableToPDFButton>
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportNoPagination}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="w-full divide-y divide-gray-300" id="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Descrição
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Orçado
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Realizado
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Diferença
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
