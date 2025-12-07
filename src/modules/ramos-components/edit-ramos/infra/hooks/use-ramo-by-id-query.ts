import { useQuery } from "@tanstack/react-query"
import { getRamoById } from "../remote"

export function useRamoByIdQuery(id: string) {
  return useQuery({
    queryKey: ["ramo", id],
    queryFn: () => getRamoById(id),
    enabled: !!id,
  })
}
