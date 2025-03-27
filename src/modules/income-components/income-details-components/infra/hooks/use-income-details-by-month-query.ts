import { getIncomeDetailsByMonth } from "@/modules/income-components/income-details-components/remote"
import { useQuery } from "@tanstack/react-query"

export function useIncomeDetailsByMonthQuery(account_id: string, year: number) {
  return useQuery({
    queryKey: [`income-details-by-month-${year}`],
    queryFn: () => getIncomeDetailsByMonth(account_id, year),
    enabled: !!account_id,
  })
}
