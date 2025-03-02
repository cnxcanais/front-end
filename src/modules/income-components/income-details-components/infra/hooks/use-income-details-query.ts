import { IncomeDetails } from "@/@types/income-details"
import { getIncomeDetails } from "@/modules/income-components/income-details-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useIncomeDetailsQuery(
  account_id: string,
  queryParams?: IncomeDetails.GetRequestParams
) {
  return useQuery({
    queryKey: ["income-details"],
    queryFn: () => getIncomeDetails(account_id, queryParams),
    enabled: !!account_id,
  })
}
