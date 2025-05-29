"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { formatCurrency } from "@/core/utils/format-currency"
import { getAccountId } from "@/core/utils/get-account-id"
import { useOrganizationsQuery } from "@/modules/organization-components/organizations/infra/remote/hooks/use-organizations-query"
import { useExpenseByGroupQuery } from "@/modules/reports-components/dre-components/infra/hooks/use-expense-by-group-query"
import { useIncomeByGroupQuery } from "@/modules/reports-components/dre-components/infra/hooks/use-income-by-group-query"
import { DREFilter } from "@/modules/reports-components/dre-components/presentation/components/DREFilter"
import { calculateTotals } from "@/modules/reports-components/dre-components/presentation/utils/dre-process-functions"
import { FileXls } from "@phosphor-icons/react"
import { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export function DRETable() {
  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState({
    start_date: new Date(currentYear, 0, 1),
    end_date: new Date(currentYear, 11, 31),
    organization_id: "",
  })

  const account_id = getAccountId()

  const methods = useForm()

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

  const organizations = useOrganizationsQuery(account_id)

  useEffect(() => {
    refetchIncomes()
    refetchExpenses()
  }, [filters])

  if (isIncomesLoading || !incomes || !expenses || isExpensesLoading)
    return <LoadingScreen />

  const totals = calculateTotals(incomes, expenses)

  return (
    <FormProvider {...methods}>
      <div>
        <DREFilter onFilterChange={setFilters} />
        <div className="my-8 flow-root max-w-[40rem]">
          <div className="mb-4 flex items-center gap-2">
            <ExportTableToPDFButton
              filename="meu-relatorio"
              options={{ orientation: "portrait" }}
              title={`DRE
                Periodo: ${filters.start_date.toLocaleDateString("pt-br", { timeZone: "UTC" })} a ${filters.end_date.toLocaleDateString("pt-br", { timeZone: "UTC" })} 
                Organização: ${!filters.organization_id ? "Todas" : organizations?.data.filter((org) => org.organization_id === filters.organization_id)[0].name}`}
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
                        Total
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        %
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
                          percentage={
                            totals.totalIncome !== 0 ?
                              (total / totals.totalIncome) * 100
                            : null
                          }
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
                            <td className="w-20 px-3 py-1.5 text-sm">—</td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}

                    <TableRow
                      label="TOTAL RECEITAS"
                      value={totals.totalIncome}
                      percentage={totals.totalIncome !== 0 ? 100 : null}
                    />

                    <TableRow
                      label="IMPOSTOS SOBRE VENDA"
                      value={totals.totalIncomeTaxes}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.totalIncomeTaxes / totals.totalIncome) * 100
                        : null
                      }
                    />

                    <TableRow
                      label="CUSTOS OPERACIONAIS"
                      value={totals.totalOperationalCosts}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.totalOperationalCosts / totals.totalIncome) *
                          100
                        : null
                      }
                    />

                    {expenses
                      .filter((e) => e.totalOperationalCosts > 0)
                      .map(({ category, totalOperationalCosts }) => (
                        <tr
                          className="text-gray-600 hover:bg-gray-50"
                          key={category}>
                          <td className="w-52 px-3 py-1.5 pl-10 text-sm">
                            {category}
                          </td>
                          <td className="w-20 px-3 py-1.5 text-sm">
                            {formatCurrency(totalOperationalCosts)}
                          </td>
                          <td className="w-20 px-3 py-1.5 text-sm">
                            {totals.totalIncome !== 0 ?
                              `${((totalOperationalCosts / totals.totalIncome) * 100).toFixed(1)}%`
                            : "—"}
                          </td>
                        </tr>
                      ))}

                    <TableRow
                      label="LUCRO BRUTO"
                      value={totals.profit}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.profit / totals.totalIncome) * 100
                        : null
                      }
                    />

                    {expenses.map(({ category, totalExpenses, groups }) => (
                      <Fragment key={category}>
                        <TableRow
                          label={category}
                          value={totalExpenses}
                          className="font-medium"
                          percentage={
                            totals.totalIncome !== 0 ?
                              (totalExpenses / totals.totalIncome) * 100
                            : null
                          }
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
                            <td className="w-20 px-3 py-1.5 text-sm">—</td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}

                    <TableRow
                      label="TOTAL DESPESAS"
                      value={totals.totalExpense}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.totalExpense / totals.totalIncome) * 100
                        : null
                      }
                    />

                    <TableRow
                      label="EBITDA"
                      value={totals.profit - totals.totalExpense}
                      percentage={
                        totals.totalIncome !== 0 ?
                          ((totals.profit - totals.totalExpense) /
                            totals.totalIncome) *
                          100
                        : null
                      }
                    />

                    <TableRow
                      label="OUTROS IMPOSTOS"
                      value={totals.totalProfitTaxes}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.totalProfitTaxes / totals.totalIncome) * 100
                        : null
                      }
                    />

                    <TableRow
                      label="LUCRO LIQUIDO"
                      value={totals.liquidProfit}
                      percentage={
                        totals.totalIncome !== 0 ?
                          (totals.liquidProfit / totals.totalIncome) * 100
                        : null
                      }
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

function TableRow({
  label,
  value,
  percentage,
  className = "",
}: {
  label: string
  value: number
  percentage?: number
  className?: string
}) {
  return (
    <tr className={`bg-gray-100 font-bold text-gray-600 ${className}`}>
      <td className="w-52 px-3 py-2 text-sm">{label}</td>
      <td className="w-20 px-3 py-1.5 text-sm">{formatCurrency(value)}</td>
      <td className="w-20 px-3 py-1.5 text-sm">
        {percentage != null ? `${percentage.toFixed(1)}%` : "—"}
      </td>
    </tr>
  )
}
