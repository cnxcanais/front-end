import { useQuery } from "@tanstack/react-query"
import { getAvatarUrl } from "../remote"

export function useAvatarUrlQuery() {
  return useQuery({
    queryKey: ["avatar-url"],
    queryFn: getAvatarUrl,
  })
}
