import { Budget } from "@/@types/budgets"
import { useQuery } from "@tanstack/react-query"
import { getBudgetIncomes } from "../remote/get-budget-incomes"

export function useBudgetIncomesQuery(
  account_id: string,
  queryParams?: Budget.QueryParamsIncome
) {
  return useQuery({
    queryKey: ["budget_incomes"],
    queryFn: () => getBudgetIncomes(account_id, queryParams),
    enabled: !!account_id,
  })
}
