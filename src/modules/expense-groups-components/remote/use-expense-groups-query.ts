import { useQuery } from "@tanstack/react-query"
import { getAllExpenseGroups } from "./expense-groups-methods"

export function useExpenseGroupQuery(account_id: string) {
  return useQuery({
    queryKey: ["expense-groups"],
    queryFn: () => getAllExpenseGroups(account_id),
    enabled: !!account_id,
  })
}
