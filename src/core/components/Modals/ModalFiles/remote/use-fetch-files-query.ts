import { useQuery } from "@tanstack/react-query"
import { fetchFiles } from "./fetch-files"

type UseFetchFilesQueryProps = {
  account_id: string
  entityId: string
  entityType: "income_source_id" | "income_id" | "expense_id" | "supplier_id"
}

export function useFetchFilesQuery({
  account_id,
  entityId,
  entityType,
}: UseFetchFilesQueryProps) {
  return useQuery({
    queryKey: ["files", entityId, entityType],
    queryFn: () =>
      fetchFiles(account_id, [{ key: entityType, value: entityId }]),
    enabled: !!account_id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
