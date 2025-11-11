import { useQuery } from "@tanstack/react-query"
import { getCorretoraById } from "../remote"

export function useCorretoraByIdQuery(id: string) {
  return useQuery({
    queryKey: ["corretora", id],
    queryFn: () => getCorretoraById(id),
    enabled: id !== "",
  })
}
