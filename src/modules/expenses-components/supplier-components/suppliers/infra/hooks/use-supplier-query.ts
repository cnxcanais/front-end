import { useQuery } from "@tanstack/react-query"
import { getSuppliers } from "../remote"

export function useSupplierQuery(account_id: string) {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers(account_id),
    enabled: !!account_id,
  })
}
