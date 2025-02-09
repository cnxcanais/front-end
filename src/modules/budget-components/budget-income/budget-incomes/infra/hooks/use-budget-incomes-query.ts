import { Budget } from "@/@types/budgets"
import { getBudgetIncomes } from "@/modules/budget-components/budget-income/budget-incomes/infra/remote/get-budget-incomes"
import { useQuery } from "@tanstack/react-query"

export function useBudgetIncomesQuery(
  account_id: string,
  queryParams: Budget.QueryParamsIncome
) {
  return useQuery({
    queryKey: ["budget_incomes"],
    queryFn: () => getBudgetIncomes(account_id, queryParams),
    enabled: !!account_id,
  })
}
