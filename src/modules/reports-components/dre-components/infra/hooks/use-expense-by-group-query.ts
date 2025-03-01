import { useQuery } from "@tanstack/react-query"
import { getExpensesByGroup } from "../remote/get-expenses-by-group"

export function useExpenseByGroupQuery(account_id: string, queryParams: any) {
  return useQuery({
    queryKey: ["expenses-by-group", { queryParams }],
    queryFn: () => getExpensesByGroup(account_id, queryParams),
    enabled: !!account_id,
  })
}
