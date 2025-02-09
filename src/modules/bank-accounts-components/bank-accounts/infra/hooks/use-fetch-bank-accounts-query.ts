import { getBankAccounts } from "@/modules/bank-accounts-components/bank-accounts/infra/remote/get-banks-account"
import { useQuery } from "@tanstack/react-query"

export function useFetchBankAccountsQuery(account_id: string) {
  return useQuery({
    queryKey: ["bank-accounts"],
    queryFn: () => getBankAccounts(account_id),
  })
}
