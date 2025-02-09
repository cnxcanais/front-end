import { getExpenseDetailsById } from "@/modules/expenses-components/expense-details-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useExpenseDetailsByIdQuery(expense_details_id: string) {
  return useQuery({
    queryKey: ["expense-details-by-id"],
    queryFn: () => getExpenseDetailsById(expense_details_id),
    enabled: !!expense_details_id,
  })
}
