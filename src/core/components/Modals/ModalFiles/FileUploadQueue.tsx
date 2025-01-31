import { Button } from "@/core/components/Button"
import { saveFile } from "@/core/components/Modals/ModalFiles/remote"
import { formatFileSize } from "@/core/utils/format-file-size"
import { getCookie } from "@/lib/cookies"
import { File, FileX, UploadSimple } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

type FileUploadQueueProps = {
  entityType: "income_source_id" | "income_id" | "expense_id" | "supplier_id"
  entityId: string
}

const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5MB em bytes

export function FileUploadQueue({
  entityId,
  entityType,
}: FileUploadQueueProps) {
  const account_id = getCookie("accountId")

  const [filesInQueue, setFilesInQueue] = useState<File[]>([])

  const { refetch } = useQuery({
    queryKey: ["files", entityId, entityType],
  })

  async function handleUpload() {
    try {
      const payload = {
        account_id,
        files: filesInQueue,
      }

      payload[entityType] = entityId

      await saveFile(payload)
      toast.success("Arquivo(s) salvo(s) com sucesso!")
      setFilesInQueue([])
      refetch()
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    }
  }

  function addFileToQueue(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)

      if (filesInQueue.length + newFiles.length > 5) {
        toast.error("Você não pode enviar mais de 5 arquivos de uma só vez.")
        return
      }

      const oversizedFile = newFiles.find((file) => file.size > FILE_SIZE_LIMIT)
      if (oversizedFile) {
        toast.error("Cada arquivo não pode ultrapassar 5MB.")
        return
      }

      setFilesInQueue((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  function removeFileFromQueue(fileName: string) {
    setFilesInQueue(filesInQueue.filter((file) => file.name !== fileName))
  }

  return (
    <>
      {filesInQueue.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Arquivos para Upload:
          </h4>
          <div className="space-y-2">
            {filesInQueue.map((file, index) => (
              <div
                key={`${index}-${file.name}-${file.lastModified}`}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center space-x-3">
                  <File size={24} className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFileFromQueue(file.name)}
                  className="text-red-500 hover:text-red-600">
                  <FileX size={20} />
                </button>
              </div>
            ))}
          </div>
          <Button
            className="mt-2 flex items-center gap-2"
            variant="primary"
            onClick={handleUpload}>
            Fazer Upload
            <UploadSimple size={24} />
          </Button>
        </div>
      )}

      <div className="mb-4">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={addFileToQueue}
          className="sr-only"
        />

        <label
          htmlFor="file-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-100 px-4 py-2.5 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-yellow-200">
          <span className="text-sm font-semibold">Selecionar Arquivos</span>
        </label>
      </div>
    </>
  )
}
