import { Fragment } from "react"

export type ViewMode = "monthly" | "quarterly" | "yearly"

export interface FilterOptions {
  startMonth: number // 0 para Janeiro, ..., 11 para Dezembro
  endMonth: number // Mesmo esquema
}

export interface CashflowGroup {
  [groupName: string]: number[]
}

export interface CashflowCategory {
  groups: CashflowGroup
  totals: number[]
  grandTotal: number
}

export function groupDataForCashflow(
  data: any[],
  isIncome: boolean,
  viewMode: ViewMode,
  filter: FilterOptions
): Record<string, CashflowCategory> {
  const periods =
    viewMode === "monthly" ? 12
    : viewMode === "quarterly" ? 4
    : 1

  const getPeriodIndex = (date: Date) => {
    const month = date.getMonth()
    if (viewMode === "monthly") return month
    if (viewMode === "quarterly") return Math.floor(month / 3)
    return 0
  }

  return data.reduce<Record<string, CashflowCategory>>((acc, item) => {
    const periodIndex = getPeriodIndex(new Date(item.due_date))

    if (
      viewMode === "monthly" &&
      (periodIndex < filter.startMonth || periodIndex > filter.endMonth)
    ) {
      return acc
    }

    const categoryName =
      isIncome ?
        item.income?.income_group.income_category.name
      : item.expense?.expense_group.expense_category.name

    const groupName =
      isIncome ?
        item.income?.income_group.group_name
      : item.expense?.expense_group.group_name

    if (!categoryName || !groupName) return acc

    const amount = parseFloat(item.amount)

    if (!acc[categoryName]) {
      acc[categoryName] = {
        groups: {},
        totals: Array(periods).fill(0),
        grandTotal: 0,
      }
    }

    if (!acc[categoryName].groups[groupName]) {
      acc[categoryName].groups[groupName] = Array(periods).fill(0)
    }

    acc[categoryName].groups[groupName][periodIndex] += amount
    acc[categoryName].totals[periodIndex] += amount
    acc[categoryName].grandTotal += amount

    return acc
  }, {})
}

export function renderCashflowTable(
  cashflowData: Record<string, CashflowCategory>,
  title: string,
  viewMode: ViewMode,
  filter: FilterOptions
) {
  const allHeaders =
    viewMode === "monthly" ?
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
      ]
    : viewMode === "quarterly" ? ["T1", "T2", "T3", "T4"]
    : ["Total"]

  const headers =
    viewMode === "monthly" ?
      allHeaders.slice(filter.startMonth, filter.endMonth + 1)
    : allHeaders

  const totalByPeriod = Array(headers.length).fill(0)
  let grandTotal = 0

  Object.values(cashflowData).forEach(({ totals }) => {
    totals.slice(filter.startMonth, filter.endMonth + 1).forEach((value, i) => {
      totalByPeriod[i] += value
      grandTotal += value
    })
  })

  return (
    <>
      <tr className="w-full bg-gray-100 font-bold text-gray-600">
        <td className="px-3">{title}</td>
        {totalByPeriod.map((total, i) => (
          <td key={i} className="px-3 text-right text-sm">
            {total > 0 ? total.toFixed(1) : ""}
          </td>
        ))}
        <td className="px-3 text-right text-sm">{grandTotal.toFixed(1)}</td>
      </tr>

      {Object.entries(cashflowData).map(
        ([category, { groups, totals, grandTotal }]) => (
          <Fragment key={category}>
            <tr>
              <td className="px-3 py-4 text-sm">{category}</td>
              {totals
                .slice(filter.startMonth, filter.endMonth + 1)
                .map((total, i) => (
                  <td
                    className="px-3 py-4 text-right text-sm text-gray-500"
                    key={i}>
                    {total > 0 ? total.toFixed(1) : ""}
                  </td>
                ))}
              <td className="px-3 py-4 text-right text-sm text-gray-500">
                {grandTotal.toFixed(1)}
              </td>
            </tr>
            {Object.entries(groups).map(([group, values]) => (
              <tr key={group}>
                <td className="pl-6 text-sm text-gray-500">{group}</td>
                {values
                  .slice(filter.startMonth, filter.endMonth + 1)
                  .map((value, i) => (
                    <td
                      className="px-3 py-4 text-right text-sm text-gray-500"
                      key={i}>
                      {value > 0 ? value.toFixed(1) : ""}
                    </td>
                  ))}
                <td className="px-3 py-4 text-right text-sm text-gray-500">
                  {values.reduce((sum, v) => sum + v, 0).toFixed(1)}
                </td>
              </tr>
            ))}
          </Fragment>
        )
      )}
    </>
  )
}
