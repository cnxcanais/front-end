import { useQuery } from "@tanstack/react-query"
import { getCorretoras } from "../remote"

export function useCorretoraQuery() {
  return useQuery({
    queryKey: ["corretora"],
    queryFn: () => getCorretoras(),
  })
}
