import { Expense } from "@/@types/expense"
import { getExpenses } from "@/modules/expenses-components/expense-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useExpenseQuery(
  account_id: string,
  queryParams?: Expense.GetRequestParams
) {
  return useQuery({
    queryKey: ["expenses", { queryParams }],
    queryFn: () => getExpenses(account_id, queryParams),
    enabled: !!account_id,
  })
}
