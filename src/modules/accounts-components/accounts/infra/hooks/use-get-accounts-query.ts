import { useQuery } from "@tanstack/react-query"
import { getAccounts } from "../remote"

export function useGetAccountsQuery() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
