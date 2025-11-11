import { useQuery } from "@tanstack/react-query"
import { getSeguradoras } from "../remote"

export function useSeguradoraQuery() {
  return useQuery({
    queryKey: ["seguradora"],
    queryFn: () => getSeguradoras(),
  })
}
