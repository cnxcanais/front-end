import { Permission } from "@/@types/permissions"
import { useQuery } from "@tanstack/react-query"
import { getPermissions } from "../remote/get-permissions"
export function useGetPermissionsQuery(
  account_id: string,
  profile_name: string
) {
  return useQuery<Permission.Type>({
    queryKey: ["permissions", account_id, profile_name],
    queryFn: () => getPermissions(account_id, profile_name),
    enabled: !!account_id,
  })
}
