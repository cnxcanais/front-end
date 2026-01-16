"use client"

import { EntityType } from "@/@types/enums/entityType"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (data: EmAnaliseData) => void
  sinistroId: string
  sinistroNumero: string
}

export type EmAnaliseData = {
  documentosRecebidos: boolean
  cnhDocumento: File | null
  laudoInicial: File | null
  observacaoAnalista: string
}

export function EmAnaliseModal({
  open,
  onClose,
  onConfirm,
  sinistroId,
  sinistroNumero,
}: Props) {
  const [formData, setFormData] = useState<EmAnaliseData>({
    documentosRecebidos: false,
    cnhDocumento: null,
    laudoInicial: null,
    observacaoAnalista: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.documentosRecebidos) {
      toast.error("Marque que os documentos foram recebidos")
      return
    }

    if (!formData.cnhDocumento) {
      toast.error("CNH/Documento do Segurado é obrigatório")
      return
    }

    if (!formData.laudoInicial) {
      toast.error("Laudo Inicial é obrigatório")
      return
    }

    onConfirm(formData)
  }

  const handleClose = () => {
    setFormData({
      documentosRecebidos: false,
      cnhDocumento: null,
      laudoInicial: null,
      observacaoAnalista: "",
    })
    onClose()
  }

  return (
    <Modal
      title={`Mover para Em Análise - ${sinistroNumero}`}
      open={open}
      onClose={handleClose}
      size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          <strong>Objetivo:</strong> Validar documentação inicial
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="documentosRecebidos"
            checked={formData.documentosRecebidos}
            onChange={(e) =>
              setFormData({
                ...formData,
                documentosRecebidos: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="documentosRecebidos" className="text-sm font-medium">
            Documentos Recebidos *
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="mb-2 block text-sm font-medium">
            CNH / Documento do Segurado *
          </label>
          <ModalFilesTrigger
            entityId={sinistroId}
            entityType={EntityType.SINISTRO}
          />
          {formData.cnhDocumento && (
            <p className="mt-1 text-xs text-gray-600">
              Arquivo: {formData.cnhDocumento.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Laudo Inicial *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setFormData({
                ...formData,
                laudoInicial: e.target.files?.[0] || null,
              })
            }
            className="w-full text-sm"
          />
          {formData.laudoInicial && (
            <p className="mt-1 text-xs text-gray-600">
              Arquivo: {formData.laudoInicial.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Observação do Analista
          </label>
          <textarea
            value={formData.observacaoAnalista}
            onChange={(e) =>
              setFormData({ ...formData, observacaoAnalista: e.target.value })
            }
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Adicione observações sobre a análise..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Confirmar e Mover
          </Button>
        </div>
      </form>
    </Modal>
  )
}
