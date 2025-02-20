import { Report } from "@/@types/reports"
import { Fragment } from "react"

export type ViewMode = "monthly" | "quarterly" | "yearly"

export interface FilterOptions {
  start_month: number // 0 para Janeiro, ..., 11 para Dezembro
  end_month: number // Mesmo esquema
}

export function groupDataForCashflow(
  data: any[],
  isIncome: boolean,
  filter: FilterOptions
): Record<string, Report.Cashflow> {
  const periods = 12

  const getPeriodIndex = (date: Date) => {
    const month = date.getMonth()
    return month
  }

  return data.reduce<Record<string, Report.Cashflow>>((acc, item) => {
    const periodIndex = getPeriodIndex(new Date(item.due_date))

    if (periodIndex < filter.start_month || periodIndex > filter.end_month) {
      return acc
    }

    const category_name =
      isIncome ?
        item.income?.income_group.income_category.name
      : item.expense?.expense_group.expense_category.name

    const group_name =
      isIncome ?
        item.income?.income_group.group_name
      : item.expense?.expense_group.group_name

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

    acc[category_name].groups[group_name][periodIndex] += amount
    acc[category_name].totals[periodIndex] += amount
    acc[category_name].grand_total += amount

    return acc
  }, {})
}

export function renderCashflowTable(
  cashflowData: Record<string, Report.Cashflow>,
  title: string,
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
  ].slice(filter.start_month, filter.end_month + 1)

  const totalByPeriod = Array(headers.length).fill(0)
  let grand_total = 0

  Object.values(cashflowData).forEach(({ totals, grand_total: total }) => {
    totals
      .slice(filter.start_month, filter.end_month + 1)
      .forEach((value, i) => {
        totalByPeriod[i] += value
      })

    grand_total += total
  })

  return (
    <>
      <tr className="bg-gray-100 font-bold text-gray-600">
        <td className="w-52 px-3 py-1.5">{title}</td>
        {totalByPeriod.map((total, i) => (
          <td key={i} className="w-20 px-3 py-1.5 text-sm">
            {total > 0 ? total.toFixed(1) : ""}
          </td>
        ))}
        <td className="w-20 px-3 py-1.5 text-sm">{grand_total.toFixed(1)}</td>
      </tr>

      {Object.entries(cashflowData).map(
        ([category, { groups, totals, grand_total }]) => (
          <Fragment key={category}>
            <tr>
              <td className="w-52 px-3 py-2.5 text-sm font-medium">
                {category}
              </td>
              {totals
                .slice(filter.start_month, filter.end_month + 1)
                .map((total, i) => (
                  <td
                    key={i}
                    className="w-20 px-3 py-2.5 text-sm text-gray-500">
                    {total > 0 ? total.toFixed(1) : ""}
                  </td>
                ))}
              <td className="w-20 px-3 py-2.5 text-sm text-gray-500">
                {grand_total.toFixed(1)}
              </td>
            </tr>
            {Object.entries(groups).map(([group, values]) => (
              <tr key={group}>
                <td className="w-52 px-3 py-2.5 pl-6 text-sm text-gray-500">
                  {group}
                </td>
                {values
                  .slice(filter.start_month, filter.end_month + 1)
                  .map((value, i) => (
                    <td
                      key={i}
                      className="w-20 px-3 py-2.5 text-sm text-gray-500">
                      {value > 0 ? value.toFixed(1) : ""}
                    </td>
                  ))}
                <td className="w-20 px-3 py-2.5 text-sm text-gray-500">
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
