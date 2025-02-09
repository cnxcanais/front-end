import { IncomeSource } from "@/@types/income-sources"
import { getIncomeSources } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useIncomeSourceQuery(
  account_id: string,
  queryParams?: IncomeSource.GetRequest
) {
  return useQuery({
    queryKey: ["income-source"],
    queryFn: () => getIncomeSources(account_id, queryParams),
    enabled: !!account_id,
  })
}
