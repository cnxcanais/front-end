import { useQuery } from "@tanstack/react-query"
import { getProdutorById } from "../remote"

export function useProdutorByIdQuery(id: string) {
  return useQuery({
    queryKey: ["produtor", id],
    queryFn: () => getProdutorById(id),
    enabled: id !== "",
  })
}
