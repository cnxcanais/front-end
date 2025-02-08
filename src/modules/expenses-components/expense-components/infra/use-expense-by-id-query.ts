import { getExpenseById } from "@/modules/expenses-components/expense-components/remote/get-expense-by-id"
import { useQuery } from "@tanstack/react-query"

export function useExpenseByIdQuery(expense_id: string) {
  return useQuery({
    queryKey: ["expense-by-id"],
    queryFn: () => getExpenseById(expense_id),
    enabled: !!expense_id,
  })
}
