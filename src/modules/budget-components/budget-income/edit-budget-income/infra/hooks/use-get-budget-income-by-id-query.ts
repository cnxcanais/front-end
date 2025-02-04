import { getBudgetIncomeById } from "@/modules/budget-components/budget-income/edit-budget-income/infra/remote/get-budget-income-by-id"
import { useQuery } from "@tanstack/react-query"

export function useGetBudgetIncomeByIdQuery(budget_income_id: string) {
  return useQuery({
    queryKey: ["budget_income", budget_income_id],
    queryFn: () => getBudgetIncomeById(budget_income_id),
    enabled: budget_income_id !== "",
  })
}
