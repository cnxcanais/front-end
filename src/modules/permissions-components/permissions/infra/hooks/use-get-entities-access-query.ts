import { useQuery } from "@tanstack/react-query"
import { getEntitiesAccess } from "../remote/get-entities-access"

export function useGetEntitiesAccessQuery(profile_id: string) {
  return useQuery({
    queryKey: ["entities-access", profile_id],
    queryFn: () => getEntitiesAccess(profile_id),
    enabled: !!profile_id,
  })
}
