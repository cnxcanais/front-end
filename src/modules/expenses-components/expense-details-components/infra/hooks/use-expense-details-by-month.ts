import { getExpenseDetailsByMonth } from "@/modules/expenses-components/expense-details-components/remote/get-expense-details-by-month"
import { useQuery } from "@tanstack/react-query"

export function useExpenseDetailsByMonthQuery(
  account_id: string,
  year: number
) {
  return useQuery({
    queryKey: [`expense-details-by-month-${year}`],
    queryFn: () => getExpenseDetailsByMonth(account_id, year),
    enabled: !!account_id,
  })
}
