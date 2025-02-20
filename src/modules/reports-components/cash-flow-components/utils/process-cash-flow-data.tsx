import { Report } from "@/@types/reports"
import { Fragment } from "react"

export type ViewMode = "monthly" | "quarterly" | "yearly"

export interface FilterOptions {
  start_month: number // 0 Jan, ... 11 Dec
  end_month: number // same logic
}

/**
 * Groups financial data for cash flow analysis based on income or expense categories and groups.
 *
 * @param data - An array of financial data items, each containing details about income or expenses.
 * @param isIncome - A boolean indicating whether the data represents income (true) or expenses (false).
 * @param filter - An object specifying the start and end months for filtering the data.
 */
export function groupDataForCashflow(
  data: any[],
  isIncome: boolean,
  filter: FilterOptions
): Record<string, Report.Cashflow> {
  const periods = 12

  return data.reduce<Record<string, Report.Cashflow>>((acc, item) => {
    const periodIndex = new Date(item.due_date).getMonth()

    if (periodIndex < filter.start_month || periodIndex > filter.end_month) {
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

    // converting to number since its coming as string from API
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

    // total value per month for group
    acc[category_name].groups[group_name][periodIndex] += amount
    // total value per month for category
    acc[category_name].totals[periodIndex] += amount
    // total value accumulated for each category
    acc[category_name].grand_total += amount

    return acc
  }, {})
}

/**
 * Renders table rows displaying cash flow data, including totals by category and group,
 * for a specified range of months.
 *
 * @param cashflowData - A record where each key is a category name, and the value is an object
 * containing group totals, monthly totals, and a grand total for that category.
 * @param title - The title to be displayed in a dedicated row that contains the total for each month displayed.
 * @param filter - An object specifying the start and end months for filtering the data.
 */
export function renderCashflowTableRows(
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
  ].slice(filter.start_month, filter.end_month + 1) // display months according to data filtered

  const totalByPeriod = Array(headers.length).fill(0)
  let grand_total = 0

  // calculate total by period for all categories + groups and grand total (all together)
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
      {/* row with monthly and year totals */}
      <tr className="bg-gray-100 font-bold text-gray-600">
        <td className="w-52 px-3 py-2 text-sm uppercase">{title}</td>
        {totalByPeriod.map((total, i) => (
          <td key={i} className="w-20 px-3 py-1.5 text-sm">
            {total > 0 ?
              total.toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })
            : ""}
          </td>
        ))}
        <td className="w-20 px-3 py-1.5 text-sm">
          {grand_total.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>

      {/* row with category totals */}
      {Object.entries(cashflowData).map(
        ([category, { groups, totals, grand_total }]) => (
          <Fragment key={category}>
            <tr>
              <td className="w-52 whitespace-nowrap px-3 py-2.5 text-sm font-medium">
                {category}
              </td>
              {totals
                .slice(filter.start_month, filter.end_month + 1)
                .map((total, i) => (
                  <td
                    key={i}
                    className="w-20 px-3 py-2.5 text-sm text-gray-500">
                    {total > 0 ?
                      total.toLocaleString("pt-BR", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })
                    : ""}
                  </td>
                ))}
              {/* grand total displayed at the end by category */}
              <td className="w-20 px-3 py-2.5 text-sm text-gray-500">
                {grand_total.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            {/* row with group totals */}
            {Object.entries(groups).map(([group, values]) => (
              <tr className="overflow-hidden" key={group}>
                <td className="w-52 whitespace-nowrap px-3 py-2.5 pl-6 text-sm text-gray-500">
                  {group}
                </td>
                {/* values are displayed respecting filtered months */}
                {values
                  .slice(filter.start_month, filter.end_month + 1)
                  .map((value, i) => (
                    <td
                      key={i}
                      className="w-20 px-3 py-2.5 text-sm text-gray-500">
                      {value > 0 ?
                        value.toLocaleString("pt-BR", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                      : ""}
                    </td>
                  ))}
                {/* total displayed at the end by group */}
                <td className="w-20 px-3 py-2.5 text-sm text-gray-500">
                  {values
                    .reduce((sum, v) => sum + v, 0)
                    .toLocaleString("pt-BR", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                </td>
              </tr>
            ))}
          </Fragment>
        )
      )}
    </>
  )
}
