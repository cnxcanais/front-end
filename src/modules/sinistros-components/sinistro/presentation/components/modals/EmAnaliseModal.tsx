"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { saveFile } from "@/core/components/Modals/ModalFiles/remote"
import { queryClient } from "@/lib/react-query"
import { changeSinistroStatus } from "@/modules/sinistros-components/sinistro/infra/remote"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  sinistroId: string
  sinistroNumero: string
}

export type EmAnaliseData = {
  documentosRecebidos: boolean
  cnhDocumento: File | null
  laudoInicial: File | null
  observacaoAnalista: string
  andamento: string
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
    andamento: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (
      !formData.andamento ||
      formData.andamento.trim() === "" ||
      formData.andamento.trim().length < 10
    ) {
      toast.error("Andamento é obrigatório e deve ter pelo menos 10 caracteres")
      return
    }

    if (
      !formData.observacaoAnalista ||
      formData.observacaoAnalista.trim() === "" ||
      formData.observacaoAnalista.trim().length < 10
    ) {
      toast.error(
        "Observação do Analista é obrigatória e deve ter pelo menos 10 caracteres"
      )
      return
    }

    try {
      // Update status with observacao if provided
      const payload: Record<string, unknown> = {
        statusNovo: SinistroStatusEnum.EM_ANALISE,
        andamento: formData.andamento,
      }

      if (formData.observacaoAnalista) {
        payload.observacao = formData.observacaoAnalista
      }

      const response = await changeSinistroStatus(sinistroId, payload)

      if (!response.id) throw new Error(response.response?.data?.message)

      await queryClient.invalidateQueries({ queryKey: ["sinistro"] })

      // Upload files
      await saveFile({
        entity: "sinistro",
        entityId: sinistroId,
        files: [formData.cnhDocumento, formData.laudoInicial].filter(
          (file): file is File => file !== null
        ),
      })

      toast.success("Status atualizado com sucesso!")
      onConfirm()
      handleClose()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error("Erro ao atualizar status: " + error?.response?.data?.message)
    }
  }

  const handleClose = () => {
    setFormData({
      documentosRecebidos: false,
      cnhDocumento: null,
      laudoInicial: null,
      observacaoAnalista: "",
      andamento: "",
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

        <div>
          <label className="mb-2 block text-sm font-medium">
            CNH / Documento do Segurado *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setFormData({
                ...formData,
                cnhDocumento: e.target.files?.[0] || null,
              })
            }
            className="w-full text-sm"
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
          <label className="mb-2 block text-sm font-medium">Andamento *</label>
          <input
            type="text"
            value={formData.andamento}
            onChange={(e) =>
              setFormData({ ...formData, andamento: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Descreva o andamento atual..."
          />
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
