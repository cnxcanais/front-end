import { useQuery } from "@tanstack/react-query"
import { getBanks } from "../remote"

export function useBankQuery(account_id: string) {
  return useQuery({
    queryKey: ["banks"],
    queryFn: () => getBanks(account_id),
    enabled: !!account_id,
  })
}
