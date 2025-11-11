import { useQuery } from "@tanstack/react-query"
import { getProdutores } from "../remote"

export function useProdutorQuery() {
  return useQuery({
    queryKey: ["produtor"],
    queryFn: () => getProdutores(),
  })
}
