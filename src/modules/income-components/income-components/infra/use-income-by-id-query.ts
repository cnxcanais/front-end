import { getIncomeById } from "@/modules/income-components/income-components/remote/get-income-by-id"
import { useQuery } from "@tanstack/react-query"

export function useIncomeByIdQuery(income_id: string) {
  return useQuery({
    queryKey: ["income-by-id"],
    queryFn: () => getIncomeById(income_id),
    enabled: !!income_id,
  })
}
