import { Button } from "@/core/components/Button"
import {
  fetchFiles,
  removeFile,
  saveFile,
} from "@/core/components/Modals/ModalFiles/remote"
import { SearchInput } from "@/core/components/SearchInput"
import { formatFileSize } from "@/core/utils/format-file-size"
import { getCookie } from "@/lib/cookies"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import {
  File as FileIcon,
  FileX,
  Paperclip,
  UploadSimple,
  X,
} from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type FileModalProps = {
  open: boolean
  onClose: (open: boolean) => void
  entityId: string
  entityType: "income_source" | "income" | "expense" | "supplier"
}

const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5MB em bytes

function FileModal({ open, onClose, entityId, entityType }: FileModalProps) {
  const [fileInput, setFileInput] = useState<File[]>([])
  const [filteredFiles, setFilteredFiles] = useState([])

  const account_id = getCookie("accountId")

  const {
    data: uploadedFiles,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["files"],
    queryFn: () => fetchFiles(account_id),
    enabled: !!account_id,
  })

  async function handleUpload() {
    try {
      const payload = {
        account_id,
        files: fileInput,
      }

      if (entityType === "income_source") {
        payload["income_source_id"] = entityId
      } else if (entityType === "income") {
        payload["income_id"] = entityId
      } else if (entityType === "expense") {
        payload["expense_id"] = entityId
      } else if (entityType === "supplier") {
        payload["supplier_id"] = entityId
      }

      await saveFile(payload)

      toast.success("Arquivo(s) salvo(s) com sucesso!")
      refetch()
      setFileInput([])
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    }
  }

  async function handleRemoveUploaded(fileId: string) {
    try {
      await removeFile(fileId)
      toast.success("Arquivo removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover arquivo. Tente novamente mais tarde.")
    }
  }

  function addFileToQueue(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)

      if (fileInput.length + newFiles.length > 5) {
        toast.error("Você não pode enviar mais de 5 arquivos de uma só vez.")
        return
      }

      const oversizedFile = newFiles.find((file) => file.size > FILE_SIZE_LIMIT)
      if (oversizedFile) {
        toast.error("Cada arquivo não pode ultrapassar 5MB.")
        return
      }

      setFileInput((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  function removeFileFromQueue(fileName: string) {
    setFileInput(fileInput.filter((file) => file.name !== fileName))
  }

  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0)
      setFilteredFiles(uploadedFiles)
  }, [uploadedFiles])

  if (!uploadedFiles || isLoading) return <></>

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(false)
        setFileInput([])
      }}
      className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => {
                  onClose(false)
                  setFileInput([])
                }}
                className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <DialogTitle
              as="h3"
              className="mb-4 text-center text-lg font-semibold text-gray-900">
              Gerenciar Arquivos
            </DialogTitle>

            {fileInput.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Arquivos para Upload:
                </h4>
                <div className="space-y-2">
                  {fileInput.map((file, index) => (
                    <div
                      key={`${index}-${file.name}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center space-x-3">
                        <FileIcon size={24} className="text-gray-400" />
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
                  disabled={isLoading}
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
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-100 px-4 py-2.5 text-white shadow-md hover:bg-yellow-200">
                <span className="text-sm font-semibold">
                  Selecionar Arquivos
                </span>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Arquivos Disponíveis
                </h4>

                <div className="max-w-96 pb-2">
                  <SearchInput
                    data={uploadedFiles}
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
                            <FileIcon size={32} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {file.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
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
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

type ModalFilesTrigger = {
  entityId: string
  entityType: "income_source" | "income" | "expense" | "supplier"
}

export function ModalFilesTrigger({ entityId, entityType }: ModalFilesTrigger) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <FileModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        entityId={entityId}
        entityType={entityType}
      />
      <Paperclip
        onClick={() => setIsOpen(true)}
        className="h-5 w-5 cursor-pointer"
      />
    </>
  )
}
