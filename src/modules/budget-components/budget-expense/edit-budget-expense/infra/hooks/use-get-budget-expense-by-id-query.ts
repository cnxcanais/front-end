import { getBudgetExpenseById } from "@/modules/budget-components/budget-expense/edit-budget-expense/infra/remote/get-budget-expense-by-id"
import { useQuery } from "@tanstack/react-query"

export function useGetBudgetExpenseByIdQuery(budget_expense_id: string) {
  return useQuery({
    queryKey: ["budget_expense", budget_expense_id],
    queryFn: () => getBudgetExpenseById(budget_expense_id),
    enabled: budget_expense_id !== "",
  })
}
