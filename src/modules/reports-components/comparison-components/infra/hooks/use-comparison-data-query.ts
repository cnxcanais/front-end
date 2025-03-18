import { useQuery } from "@tanstack/react-query"
import { getComparisonData } from "../remote/get-comparison-data"

export function useComparisonDataQuery(account_id: string, queryParams: any) {
  return useQuery({
    queryKey: ["comparison-data", { queryParams }],
    queryFn: () => getComparisonData(account_id, queryParams),
    enabled: !!account_id,
  })
}
