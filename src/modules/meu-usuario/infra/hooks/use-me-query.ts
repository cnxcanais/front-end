import { useQuery } from "@tanstack/react-query"
import { getMe } from "../remote"

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  })
}
