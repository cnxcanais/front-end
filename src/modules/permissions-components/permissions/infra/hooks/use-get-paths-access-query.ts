import { useQuery } from "@tanstack/react-query"
import { getPathsAccess } from "../remote/get-paths-access"

export function useGetPathsAccessQuery(profile_id: string) {
  return useQuery({
    queryKey: ["path-access", profile_id],
    queryFn: () => getPathsAccess(profile_id),
    enabled: !!profile_id,
  })
}
