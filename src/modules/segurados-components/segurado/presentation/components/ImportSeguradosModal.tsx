"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"
import { importSegurados } from "../../infra/remote"

interface ImportSeguradosModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportSeguradosModal({
  open,
  onClose,
  onSuccess,
}: ImportSeguradosModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo CSV")
      return
    }

    try {
      await importSegurados(selectedFile)
      toast.success("Segurados importados com sucesso!")
      setSelectedFile(null)
      onSuccess()
      onClose()
    } catch (error) {
      console.log(error)
      toast.error("Erro ao importar segurados")
    }
  }

  return (
    <Modal
      title="Importar Segurados"
      content="Selecione um arquivo CSV para importar"
      onClose={() => {
        setSelectedFile(null)
        onClose()
      }}
      open={open}>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="rounded border p-2"
        />
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleImport} variant="secondary">
            Importar
          </Button>
          <Button onClick={onClose} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
