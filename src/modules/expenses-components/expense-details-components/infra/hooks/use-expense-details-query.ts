import { ExpenseDetails } from "@/@types/expense-details"
import { getExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useExpenseDetailsQuery(
  account_id: string,
  queryParams?: ExpenseDetails.GetRequestParams
) {
  return useQuery({
    queryKey: ["expense-details"],
    queryFn: () => getExpenseDetails(account_id, queryParams),
    enabled: !!account_id,
  })
}
