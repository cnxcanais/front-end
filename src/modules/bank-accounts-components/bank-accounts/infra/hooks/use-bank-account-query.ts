import { useQuery } from "@tanstack/react-query"
import { getBankAccounts } from "../remote"

export function useBankAccountsQuery(account_id: string) {
  return useQuery({
    queryKey: ["banks-account"],
    queryFn: () => getBankAccounts(account_id),
    enabled: !!account_id,
  })
}
