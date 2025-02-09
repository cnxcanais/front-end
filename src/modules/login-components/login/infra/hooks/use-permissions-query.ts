import permissions from "@/core/utils/components_permission.json"
import { useQuery } from "@tanstack/react-query"

const setPermission = () => {
  return permissions.componentAccess
}

export function usePermissionQuery() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: setPermission,
    staleTime: Infinity,
  })
}
