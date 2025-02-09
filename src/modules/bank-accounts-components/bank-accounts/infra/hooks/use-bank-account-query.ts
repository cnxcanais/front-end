import { getBankAccounts } from "@/modules/bank-accounts-components/bank-accounts/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useBankAccountsQuery(account_id: string) {
  return useQuery({
    queryKey: ["banks-account"],
    queryFn: () => getBankAccounts(account_id),
    enabled: !!account_id,
  })
}
