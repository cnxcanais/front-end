import { Income } from "@/@types/income"
import { getIncomes } from "@/modules/income-components/income-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useIncomeQuery(
  account_id: string,
  queryParams: Income.GetRequest
) {
  return useQuery({
    queryKey:
      Object.values(queryParams).length > 0 ?
        ["incomes", queryParams]
      : ["incomes"],
    queryFn: () => getIncomes(account_id, queryParams),
    enabled: !!account_id,
  })
}
