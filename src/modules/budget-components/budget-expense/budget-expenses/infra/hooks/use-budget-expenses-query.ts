import { Budget } from "@/@types/budgets"
import { getBudgetExpenses } from "@/modules/budget-components/budget-expense/budget-expenses/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useBudgetExpensesQuery(
  account_id: string,
  queryParams: Budget.QueryParamsExpense
) {
  return useQuery({
    queryKey: ["budget_expenses"],
    queryFn: () => getBudgetExpenses(account_id, queryParams),
    enabled: !!account_id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
