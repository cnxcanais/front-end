import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  fetchFiles,
  removeFile,
} from "@/core/components/Modals/ModalFiles/remote"
import { SearchInput } from "@/core/components/SearchInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { File, X } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type FileListProps = {
  entityType: "income_source_id" | "income_id" | "expense_id" | "supplier_id"
  entityId: string
}

export function FileList({ entityId, entityType }: FileListProps) {
  const [filteredFiles, setFilteredFiles] = useState([])

  const account_id = getAccountId()

  const {
    data: fileList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["files", entityId, entityType],
    queryFn: () =>
      fetchFiles(account_id, [{ key: entityType, value: entityId }]),
    enabled: !!account_id,
  })

  async function handleRemoveUploaded(fileId: string) {
    try {
      await removeFile(fileId)
      toast.success("Arquivo removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover arquivo. Tente novamente mais tarde.")
    }
  }

  useEffect(() => {
    if (fileList && fileList.length > 0) setFilteredFiles(fileList)
  }, [fileList])

  if (!fileList || isLoading) return <LoadingScreen fullScreen={false} />

  if (fileList.length === 0)
    return (
      <h3 className="text-sm font-medium text-gray-500">
        Nenhum arquivo salvo.
      </h3>
    )

  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-gray-700">
        Arquivos Disponíveis
      </h4>

      <div className="max-w-96 pb-2">
        <SearchInput
          data={fileList}
          searchParam="description"
          onSearchResult={(result) => setFilteredFiles(result)}
        />
      </div>

      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filteredFiles.map((file) => (
            <Link
              key={file.file_id}
              href={file.file_url}
              className="group relative cursor-pointer rounded-lg border p-2 hover:border-blue-500">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <div className="flex items-center justify-center">
                  <File size={32} className="text-gray-400" />
                </div>
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.description}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveUploaded(file.file_id)
                }}
                className="absolute right-2 top-2 rounded-full border border-black bg-white p-1 text-black opacity-0 shadow-sm transition-opacity hover:border-white hover:bg-gray-500 hover:text-white group-hover:opacity-100">
                <X size={16} />
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
