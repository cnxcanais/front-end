import { Report } from "@/@types/reports"
import { Fragment } from "react"

export type ViewMode = "monthly" | "quarterly" | "yearly"

export interface FilterOptions {
  start_date: Date
  end_date: Date
}

export function groupDataForCashflow(
  data: any[],
  isIncome: boolean,
  filter: FilterOptions
): Record<string, Report.Cashflow> {
  const periods = 12

  return data
    .filter((item) => item.is_paid)
    .reduce<Record<string, Report.Cashflow>>((acc, item) => {
      const dueDate = new Date(item.due_date)

      if (dueDate < filter.start_date || dueDate > filter.end_date) {
        return acc
      }

      const category_name =
        isIncome ?
          item.income.income_group.income_category.name
        : item.expense.expense_group.expense_category.name

      const group_name =
        isIncome ?
          item.income.income_group.group_name
        : item.expense.expense_group.group_name

      if (!category_name || !group_name) return acc

      const amount = parseFloat(item.amount)

      if (!acc[category_name]) {
        acc[category_name] = {
          groups: {},
          totals: Array(periods).fill(0),
          grand_total: 0,
        }
      }

      if (!acc[category_name].groups[group_name]) {
        acc[category_name].groups[group_name] = Array(periods).fill(0)
      }

      const periodIndex = dueDate.getMonth()

      acc[category_name].groups[group_name][periodIndex] += amount
      acc[category_name].totals[periodIndex] += amount
      acc[category_name].grand_total += amount

      return acc
    }, {})
}

export function renderCashflowTableRows(
  incomeData: Record<string, Report.Cashflow>,
  expenseData: Record<string, Report.Cashflow>,
  filter: FilterOptions
) {
  const headers = [
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

  const startMonth = filter.start_date.getMonth()
  const endMonth = filter.end_date.getMonth()
  const displayedMonths = headers.slice(startMonth, endMonth + 1)

  const totalIncomeByPeriod = Array(headers.length).fill(0)
  const totalExpenseByPeriod = Array(headers.length).fill(0)
  let totalIncome = 0
  let totalExpense = 0

  Object.values(incomeData).forEach(({ totals, grand_total }) => {
    totals.forEach((value, i) => {
      totalIncomeByPeriod[i] += value
    })
    totalIncome += grand_total
  })

  Object.values(expenseData).forEach(({ totals, grand_total }) => {
    totals.forEach((value, i) => {
      totalExpenseByPeriod[i] += value
    })
    totalExpense += grand_total
  })

  const balanceByPeriod = totalIncomeByPeriod.map(
    (income, i) => income - totalExpenseByPeriod[i]
  )

  const totalBalance = totalIncome - totalExpense

  return (
    <>
      {/* Income Section with Categories and Groups */}
      <tr className="bg-gray-100 font-bold text-gray-600">
        <td className="w-52 px-3 py-2 text-sm uppercase">Receita</td>
        {displayedMonths.map((_, i) => (
          <td key={i} className="w-20 px-3 py-1.5 text-sm">
            {totalIncomeByPeriod[i + startMonth].toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </td>
        ))}
        <td className="w-20 px-3 py-1.5 text-sm">
          {totalIncome.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>
      {renderCategoryAndGroupDetails(incomeData, startMonth, endMonth)}

      {/* Expense Section with Categories and Groups */}
      <tr className="bg-gray-100 font-bold text-gray-600">
        <td className="w-52 px-3 py-2 text-sm uppercase">Despesa</td>
        {displayedMonths.map((_, i) => (
          <td key={i} className="w-20 px-3 py-1.5 text-sm">
            {totalExpenseByPeriod[i + startMonth].toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </td>
        ))}
        <td className="w-20 px-3 py-1.5 text-sm">
          {totalExpense.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>
      {renderCategoryAndGroupDetails(expenseData, startMonth, endMonth)}

      {/* Balance */}
      <tr className="bg-blue-400 font-bold text-white">
        <td className="w-52 px-3 py-2 text-sm uppercase">Saldo</td>
        {displayedMonths.map((_, i) => (
          <td key={i} className="w-20 px-3 py-1.5 text-sm">
            {balanceByPeriod[i + startMonth].toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </td>
        ))}
        <td className="w-20 px-3 py-1.5 text-sm">
          {totalBalance.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>
    </>
  )
}

function renderCategoryAndGroupDetails(
  cashflowData: Record<string, Report.Cashflow>,
  startMonth: number,
  endMonth: number
) {
  return (
    <>
      {Object.entries(cashflowData).map(([categoryName, categoryData]) => (
        <Fragment key={categoryName}>
          {/* Category Row */}
          <tr>
            <td className="w-52 px-3 py-2 pl-6 text-sm font-medium">
              {categoryName}
            </td>
            {categoryData.totals
              .slice(startMonth, endMonth + 1)
              .map((total, i) => (
                <td key={i} className="w-20 px-3 py-1.5 text-sm">
                  {total.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </td>
              ))}
            <td className="w-20 px-3 py-1.5 text-sm font-medium">
              {categoryData.grand_total.toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>

          {/* Group Rows */}
          {Object.entries(categoryData.groups).map(
            ([groupName, groupValues]) => (
              <tr key={groupName} className="text-gray-600 hover:bg-gray-50">
                <td className="w-52 px-3 py-1.5 pl-10 text-sm">{groupName}</td>
                {groupValues.slice(startMonth, endMonth + 1).map((value, i) => (
                  <td key={i} className="w-20 px-3 py-1.5 text-sm">
                    {value.toLocaleString("pt-BR", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </td>
                ))}
                <td className="w-20 px-3 py-1.5 text-sm">
                  {groupValues
                    .reduce((sum, value) => sum + value, 0)
                    .toLocaleString("pt-BR", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                </td>
              </tr>
            )
          )}
        </Fragment>
      ))}
    </>
  )
}
