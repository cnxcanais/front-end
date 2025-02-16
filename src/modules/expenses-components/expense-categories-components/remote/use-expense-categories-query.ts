import { useQuery } from "@tanstack/react-query"
import { getAllExpenseCategories } from "./expense-categories-methods"

export function useExpenseCategoryQuery(account_id: string) {
  return useQuery({
    queryKey: ["expense-categories"],
    queryFn: () => getAllExpenseCategories(account_id),
    enabled: !!account_id,
  })
}
