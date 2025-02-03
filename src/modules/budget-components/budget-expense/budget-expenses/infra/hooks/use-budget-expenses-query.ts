import { Budget } from "@/@types/budgets"
import { useQuery } from "@tanstack/react-query"
import { getBudgetExpenses } from "../remote"

export function useBudgetExpensesQuery(
  account_id: string,
  queryParams?: Budget.QueryParamsExpense
) {
  return useQuery({
    queryKey: ["budget_expenses"],
    queryFn: () => getBudgetExpenses(account_id, queryParams),
    enabled: !!account_id,
  })
}
