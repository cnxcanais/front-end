import { useQuery } from "@tanstack/react-query"
import { getLogs } from "../remote/get-logs-by-account"

export function useGetLogsQuery(account_id: string) {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => getLogs(account_id),
    enabled: !!account_id,
  })
}
