import { useQuery } from "@tanstack/react-query"
import { getBudgetIncomeById } from "../remote/get-budget-income-by-id"

export function useGetBudgetIncomeByIdQuery(budget_income_id: string) {
  return useQuery({
    queryKey: ["budget_income", budget_income_id],
    queryFn: () => getBudgetIncomeById(budget_income_id),
    enabled: budget_income_id !== "",
  })
}
