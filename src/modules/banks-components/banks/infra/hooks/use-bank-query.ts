import { getBanks } from "@/modules/banks-components/banks/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useBankQuery(account_id: string) {
  return useQuery({
    queryKey: ["banks"],
    queryFn: () => getBanks(account_id),
    enabled: !!account_id,
  })
}
