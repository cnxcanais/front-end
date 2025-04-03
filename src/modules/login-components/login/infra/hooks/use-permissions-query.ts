import { api } from "@/lib/axios"
import { getCookie } from "@/lib/cookies"
import { useQuery } from "@tanstack/react-query"

const setPermission = async () => {
  const profileName = getCookie("profile_name")
  const accountId = getCookie("accountId")

  if (!profileName || !accountId) {
    throw new Error("Required cookies not found")
  }

  const { data } = await api.get(`/permissions/${accountId}/${profileName}`)

  return data.permissions.componentAccess || null
}

export function usePermissionQuery() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: setPermission,
    staleTime: Infinity,
    enabled: !!getCookie("profile_name") && !!getCookie("accountId"),
  })
}
