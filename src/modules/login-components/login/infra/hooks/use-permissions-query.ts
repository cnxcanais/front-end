import permissions from "@/core/utils/permission.json"
import { useQuery } from "@tanstack/react-query"

const setPermission = () => {
  return permissions
}

export function usePermissionQuery() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: setPermission,
    staleTime: Infinity,
  })
}
