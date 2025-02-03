import { useQuery } from "@tanstack/react-query"
import { getBudgetExpenseById } from "../remote/get-budget-expense-by-id"

export function useGetBudgetExpenseByIdQuery(budget_expense_id: string) {
  return useQuery({
    queryKey: ["budget_expense", budget_expense_id],
    queryFn: () => getBudgetExpenseById(budget_expense_id),
    enabled: budget_expense_id !== "",
  })
}
