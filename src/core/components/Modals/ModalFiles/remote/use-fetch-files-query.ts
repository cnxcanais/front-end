import { useQuery } from "@tanstack/react-query"
import { fetchFiles } from "./fetch-files"

type UseFetchFilesQueryProps = {
  entityId: string
  entityType:
    | "seguradora"
    | "produtor"
    | "corretora"
    | "segurado"
    | "proposta-apolice"
}

export function useFetchFilesQuery({
  entityId,
  entityType,
}: UseFetchFilesQueryProps) {
  return useQuery({
    queryKey: ["files", entityId, entityType],
    queryFn: () => fetchFiles(entityId, entityType),
  })
}
