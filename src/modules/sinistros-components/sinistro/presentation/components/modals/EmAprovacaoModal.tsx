"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Usuario } from "@/@types/usuario"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import { Currency } from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { getCookie } from "@/lib/cookies"
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
  isAdmin: boolean
  usuarios: Usuario.GetResponse
}

export namespace EmAprovacaoData {
  export type Aprovado = {
    observacao: string
    dataAprovacao: string
    formaIndenizacao: string
    valorAprovado: number
  }
  export type Reprovado = {
    motivoReprovacao: string
    justificativaReprovacao: string
    documentoApoio: File | null
  }
}

export type FormData = {
  isAprovado: boolean
  aprovado: EmAprovacaoData.Aprovado | null
  reprovado: EmAprovacaoData.Reprovado | null
}

export type PayloadAprovacao = EmAprovacaoData.Aprovado & {
  statusNovo: SinistroStatusEnum
}

export type PayloadReprovacao = EmAprovacaoData.Reprovado & {
  statusNovo: SinistroStatusEnum
}

export function EmAprovacaoModal({
  open,
  onClose,
  onConfirm,
  sinistroId,
  sinistroNumero,
  isAdmin,
  usuarios,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    isAprovado: true,
    aprovado: null,
    reprovado: null,
  })

  const corretoraId = getCookie("corretoraId") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.isAprovado) {
      if (
        !formData.aprovado?.dataAprovacao ||
        formData.aprovado?.dataAprovacao.trim() === ""
      ) {
        toast.error("Escolha a data de aprovação")
        return
      }

      if (formData.aprovado?.valorAprovado <= 0) {
        toast.error("Valor aprovado é obrigatório")
        return
      }

      if (
        !formData.aprovado?.formaIndenizacao ||
        formData.aprovado?.formaIndenizacao.trim() === ""
      ) {
        toast.error("Escolha a forma de indenização")
        return
      }

      if (formData.aprovado?.observacao.trim() === "") {
        toast.error("Observação Final é obrigatória")
        return
      }
    }

    if (!formData.isAprovado) {
      if (
        !formData.reprovado?.motivoReprovacao ||
        formData.reprovado?.motivoReprovacao.trim() === ""
      ) {
        toast.error("Motivo de reprovação é obrigatório")
        return
      }

      if (
        !formData.reprovado?.justificativaReprovacao ||
        formData.reprovado?.justificativaReprovacao.trim() === ""
      ) {
        toast.error("Justificativa de reprovação é obrigatória")
        return
      }
    }

    try {
      if (formData.isAprovado) {
        // Update status with aprovado data
        const payload: PayloadAprovacao = {
          statusNovo: SinistroStatusEnum.APROVADO,
          dataAprovacao: formData.aprovado!.dataAprovacao,
          formaIndenizacao: formData.aprovado!.formaIndenizacao,
          valorAprovado: formData.aprovado!.valorAprovado,
          observacao: formData.aprovado!.observacao,
        }

        const response = await changeSinistroStatus(sinistroId, payload)

        if (!response.id) throw new Error(response.response?.data?.message)
      } else {
        // Update status with reprovado data
        const payload: PayloadReprovacao = {
          statusNovo: SinistroStatusEnum.REPROVADO,
          motivoReprovacao: formData.reprovado!.motivoReprovacao,
          justificativaReprovacao: formData.reprovado!.justificativaReprovacao,
          documentoApoio: formData.reprovado!.documentoApoio,
        }

        const response = await changeSinistroStatus(sinistroId, payload)

        if (!response.id) throw new Error(response.response?.data?.message)
      }

      await queryClient.invalidateQueries({ queryKey: ["sinistro"] })

      toast.success("Status atualizado com sucesso!")
      onConfirm()
      handleClose()
      return
    } catch (error) {
      toast.error("Erro ao atualizar status: " + error?.response?.data?.message)
      return
    }
  }

  const formasIndenizacaoOptions = [
    { text: "Reparo", value: "REPARO" },
    { text: "Substituição", value: "SUBSTITUICAO" },
    { text: "Pagamento em Dinheiro", value: "PAGAMENTO_DINHEIRO" },
  ]

  const motivosReprovacaoOptions = [
    { text: "Documentação Incompleta", value: "DOCUMENTACAO_INCOMPLETA" },
    { text: "Fraude Suspeita", value: "FRAUDE_SUSPEITA" },
    { text: "Cobertura Negada", value: "COBERTURA_NEGADA" },
    { text: "Outro", value: "OUTRO" },
  ]

  const handleClose = () => {
    setFormData({
      isAprovado: true,
      aprovado: null,
      reprovado: null,
    })
    onClose()
  }

  return (
    <Modal
      title={`Mover para Em Regulação - ${sinistroNumero}`}
      open={open}
      onClose={handleClose}
      size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          <strong>Objetivo:</strong> Avaliação técnica do sinistro
        </div>

        <div className="flex items-center gap-2">
          <AutocompleteInput
            options={usuariosOptions}
            label="Responsável Usuário *"
            field_name="responsavelUsuarioId"
            onChange={(e) =>
              setFormData({
                ...formData,
                responsavelUsuarioId: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Laudo Técnico *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setFormData({
                ...formData,
                laudoTecnico: e.target.files?.[0] || null,
              })
            }
            className="w-full text-sm"
          />
          {formData.laudoTecnico && (
            <p className="mt-1 text-xs text-gray-600">
              Arquivo: {formData.laudoTecnico.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor Estimado *
          </label>
          <Currency
            value={formData.valorEstimado}
            onChange={(e) =>
              setFormData({
                ...formData,
                valorEstimado: e,
              })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Valor em R$"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Observação / Parecer Técnico *
          </label>
          <textarea
            value={formData.observacao}
            onChange={(e) =>
              setFormData({ ...formData, observacao: e.target.value })
            }
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Adicione parecer técnico..."
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
