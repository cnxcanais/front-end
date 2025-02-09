import { getAccounts } from "@/modules/accounts-components/accounts/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useGetAccountsQuery() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
