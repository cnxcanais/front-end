import { useQuery } from "@tanstack/react-query"
import { getBancos } from "../remote/get-bancos"

export function useBancosQuery() {
  return useQuery({
    queryKey: ["bancos"],
    queryFn: () => getBancos(),
  })
}
