"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
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

type Reprovado = {
  observacao: string
  motivoReprovacao: string
  justificativaReprovacao: string
}

export function ReprovadoModal({
  open,
  onClose,
  onConfirm,
  sinistroId,
  sinistroNumero,
}: Props) {
  const [formData, setFormData] = useState<Reprovado>({
    observacao: "",
    motivoReprovacao: "",
    justificativaReprovacao: "",
  })

  const handleClose = () => {
    setFormData({
      observacao: "",
      motivoReprovacao: "",
      justificativaReprovacao: "",
    })
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.justificativaReprovacao ||
      formData.justificativaReprovacao.trim() === ""
    ) {
      toast.error("Escolha a forma de pagamento")
      return
    }

    if (formData.observacao.trim() === "" || formData.observacao.length <= 10) {
      toast.error("Observação deve ter no mínimo 10 caracteres")
      return
    }

    try {
      const response = await changeSinistroStatus(sinistroId, {
        ...formData,
        statusNovo: SinistroStatusEnum.REPROVADO,
      })

      if (!response.id) throw new Error(response.response?.data?.message)
      await queryClient.invalidateQueries({ queryKey: ["sinistro"] })

      toast.success("Status atualizado com sucesso!")
      onConfirm()
      handleClose()
      return
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error("Erro ao atualizar status: " + error?.response?.data?.message)
      return
    }
  }

  return (
    <Modal
      title={`Aprovação - ${sinistroNumero}`}
      open={open}
      onClose={handleClose}
      size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
          <strong>Objetivo:</strong> Reprovar Sinistro
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Motivo Reprovação *
          </label>
          <input
            type="text"
            value={formData.motivoReprovacao}
            onChange={(e) =>
              setFormData({
                ...formData,
                motivoReprovacao: e.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Justificativa Reprovação *
          </label>
          <textarea
            value={formData.justificativaReprovacao}
            onChange={(e) =>
              setFormData({
                ...formData,
                justificativaReprovacao: e.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Observação Final *
          </label>
          <textarea
            value={formData.observacao}
            onChange={(e) =>
              setFormData({
                ...formData,
                observacao: e.target.value,
              })
            }
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Adicione observações finais..."
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
