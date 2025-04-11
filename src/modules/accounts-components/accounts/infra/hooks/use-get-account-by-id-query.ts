import { useQuery } from "@tanstack/react-query"
import { getAccountById } from "../remote/get-account-by-id"

export function useGetAccountById(id: string | undefined) {
  return useQuery({
    queryKey: ["accounts_by_id", id],
    queryFn: async () => {
      const response = await getAccountById(id)
      if (!response) {
        throw new Error("Account not found")
      }
      return response
    },
    enabled: !!id,
  })
}
