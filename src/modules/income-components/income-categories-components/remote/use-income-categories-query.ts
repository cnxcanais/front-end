import { useQuery } from "@tanstack/react-query"
import { getAllIncomeCategories } from "./income-categories-methods"

export function useIncomeCategoryQuery(account_id: string) {
  return useQuery({
    queryKey: ["income-categories"],
    queryFn: () => getAllIncomeCategories(account_id),
    enabled: !!account_id,
  })
}
