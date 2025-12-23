"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { FileCsv } from "@phosphor-icons/react"
import { useState } from "react"

interface ImportPropostasModalProps {
  open: boolean
  onClose: () => void
  onImport: (file: File) => void
}

export function ImportPropostasModal({
  open,
  onClose,
  onImport,
}: ImportPropostasModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile)
      setSelectedFile(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <Modal title="Importar Propostas" onClose={handleClose} open={open}>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Selecione o arquivo CSV
          </label>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
              <FileCsv size={20} />
              <span className="text-sm">
                {selectedFile ? selectedFile.name : "Escolher arquivo"}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {selectedFile && (
            <p className="text-xs text-gray-500">
              Arquivo selecionado: {selectedFile.name}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={handleClose} variant="tertiary">
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            variant="secondary"
            disabled={!selectedFile}>
            Importar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
