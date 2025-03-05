import { useQuery } from "@tanstack/react-query"
import { getIncomesByGroup } from "../remote/get-incomes-by-group"

export function useIncomeByGroupQuery(account_id: string, queryParams: any) {
  return useQuery({
    queryKey: ["income-by-groups", { queryParams }],
    queryFn: () => getIncomesByGroup(account_id, queryParams),
    enabled: !!account_id,
  })
}
