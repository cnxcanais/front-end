"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { formatCurrency } from "@/core/utils/format-currency"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseByGroupQuery } from "@/modules/reports-components/dre-components/infra/hooks/use-expense-by-group-query"
import { useIncomeByGroupQuery } from "@/modules/reports-components/dre-components/infra/hooks/use-income-by-group-query"
import { DREFilter } from "@/modules/reports-components/dre-components/presentation/components/DREFilter"
import { calculateTotals } from "@/modules/reports-components/dre-components/presentation/utils/dre-process-functions"
import { FileXls } from "@phosphor-icons/react"
import { Fragment, useEffect, useState } from "react"

export function DRETable() {
  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState({
    start_date: new Date(currentYear, 0, 1),
    end_date: new Date(currentYear, 11, 31),
  })
  const account_id = getAccountId()

  const {
    data: incomes,
    isLoading: isIncomesLoading,
    refetch: refetchIncomes,
  } = useIncomeByGroupQuery(account_id, filters)

  const {
    data: expenses,
    isLoading: isExpensesLoading,
    refetch: refetchExpenses,
  } = useExpenseByGroupQuery(account_id, filters)

  useEffect(() => {
    refetchIncomes()
    refetchExpenses()
  }, [filters])

  if (isIncomesLoading || !incomes || !expenses || isExpensesLoading)
    return <LoadingScreen />

  const totals = calculateTotals(incomes, expenses)

  return (
    <div>
      <DREFilter onFilterChange={setFilters} />
      <div className="my-8 flow-root max-w-[40rem]">
        <Button
          className="mb-2 flex items-center gap-1"
          variant="secondary"
          onClick={exportToExcel}>
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
                      Descrição
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {incomes.map(({ category, total, groups }) => (
                    <Fragment key={category}>
                      <TableRow
                        label={category}
                        value={total}
                        className="font-medium"
                      />
                      {groups.map(({ group, incomes }) => (
                        <tr
                          className="text-gray-600 hover:bg-gray-50"
                          key={group}>
                          <td className="w-52 px-3 py-1.5 pl-10 text-sm">
                            {group}
                          </td>
                          <td className="w-20 px-3 py-1.5 text-sm">
                            {formatCurrency(incomes)}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  <TableRow label="TOTAL RECEITAS" value={totals.totalIncome} />
                  <TableRow
                    label="IMPOSTOS SOBRE VENDA"
                    value={totals.totalIncomeTaxes}
                  />
                  <TableRow
                    label="CUSTOS OPERACIONAIS"
                    value={totals.totalOperationalCosts}
                  />
                  <TableRow label="LUCRO BRUTO" value={totals.profit} />
                  {expenses.map(({ category, totalExpenses, groups }) => (
                    <Fragment key={category}>
                      <TableRow
                        label={category}
                        value={totalExpenses}
                        className="font-medium"
                      />
                      {groups.map(({ group, expenses }) => (
                        <tr
                          className="text-gray-600 hover:bg-gray-50"
                          key={group}>
                          <td className="w-52 px-3 py-1.5 pl-10 text-sm">
                            {group}
                          </td>
                          <td className="w-20 px-3 py-1.5 text-sm">
                            {formatCurrency(expenses)}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  <TableRow
                    label="TOTAL DESPESAS"
                    value={totals.totalExpense}
                  />
                  <TableRow
                    label="OUTROS IMPOSTOS"
                    value={totals.totalProfitTaxes}
                  />
                  <TableRow label="LUCRO LIQUIDO" value={totals.liquidProfit} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableRow({ label, value, className = "" }) {
  return (
    <tr className={`bg-gray-100 font-bold text-gray-600 ${className}`}>
      <td className="w-52 px-3 py-2 text-sm">{label}</td>
      <td className="w-20 px-3 py-1.5 text-sm">{formatCurrency(value)}</td>
    </tr>
  )
}
