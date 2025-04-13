import { useQuery } from "@tanstack/react-query"
import { getAccountById } from "../remote/get-account-by-id"

export function useGetAccountById(id: string | undefined) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
  })
}
