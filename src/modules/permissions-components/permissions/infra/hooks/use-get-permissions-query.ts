import { useQuery } from "@tanstack/react-query"
import { getPermissions } from "../remote/get-permissions"

export function useGetPermissionsQuery(
  account_id: string,
  profile_name: string
) {
  return useQuery({
    queryKey: ["permissions", account_id, profile_name],
    queryFn: () => getPermissions(account_id, profile_name),
    enabled: !!account_id,
  })
}
