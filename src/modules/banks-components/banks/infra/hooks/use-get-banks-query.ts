import { getBanks } from "@/modules/banks-components/banks/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useGetBanksQuery(account_id: string) {
  return useQuery({
    queryKey: ["bank"],
    queryFn: () => getBanks(account_id),
    enabled: !!account_id,
  })
}
