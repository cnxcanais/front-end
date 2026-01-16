import { EntityType } from "@/@types/enums/entityType"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { removeFile } from "@/core/components/Modals/ModalFiles/remote"
import { SearchInput } from "@/core/components/SearchInput"
import { File, X } from "@phosphor-icons/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useFetchFilesQuery } from "./remote/use-fetch-files-query"

type FileListProps = {
  entityType: EntityType
  entityId: string
  isAdmin?: boolean
}

export function FileList({ entityId, entityType, isAdmin }: FileListProps) {
  const [filteredFiles, setFilteredFiles] = useState([])
  const [entityFiles, setEntityFiles] = useState([])

  const {
    data: fileList,
    isLoading,
    refetch,
  } = useFetchFilesQuery({ entityId, entityType })

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
    if (fileList) {
      setEntityFiles(fileList)
      setFilteredFiles(fileList)
    }
  }, [fileList])

  if (isLoading) return <LoadingScreen fullScreen={false} />

  if (!fileList || entityFiles.length === 0)
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
          data={entityFiles}
          searchParam="originalName"
          onSearchResult={(result) => setFilteredFiles(result)}
        />
      </div>

      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filteredFiles.map((file) => (
            <Link
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative cursor-pointer rounded-lg border p-2 hover:border-blue-500">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <div className="flex items-center justify-center">
                  <File size={32} className="text-gray-400" />
                </div>
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.originalName}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveUploaded(file.id)
                }}
                className={`border-black text-black absolute right-2 top-2 rounded-full border bg-white p-1 shadow-sm transition-opacity hover:border-white hover:bg-gray-500 hover:text-white ${
                  isAdmin ? "opacity-0 group-hover:opacity-100" : "hidden"
                }`}>
                <X size={16} />
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
