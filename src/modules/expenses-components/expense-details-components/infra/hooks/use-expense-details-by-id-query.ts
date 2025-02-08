import { getIncomeDetailsById } from "@/modules/income-components/income-details-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useIncomeDetailsByIdQuery(income_details_id: string) {
  return useQuery({
    queryKey: ["income-details-by-id"],
    queryFn: () => getIncomeDetailsById(income_details_id),
    enabled: !!income_details_id,
  })
}
