import { getAllIncomeGroups } from "@/modules/income-components/income-groups-components/remote/income-group"
import { useQuery } from "@tanstack/react-query"

export function useIncomeGroupQuery(account_id: string) {
  return useQuery({
    queryKey: ["income-groups"],
    queryFn: () => getAllIncomeGroups(account_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
