import { useQuery } from "@tanstack/react-query"
import { getIncomeSources } from "../remote"

export function useGetIncomeSourcesQuery(account_id: string) {
  return useQuery({
    queryKey: ["income-sources"],
    queryFn: () => getIncomeSources(account_id),
    enabled: !!account_id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
