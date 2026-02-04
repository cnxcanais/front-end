"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import { Currency } from "@/core/components/Input"
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

const formaPagamentoOptions = [
  { text: "Pix", value: "pix" },
  { text: "TED", value: "ted" },
  { text: "DOC", value: "doc" },
  { text: "Cheque", value: "cheque" },
  { text: "Dinheiro", value: "dinheiro" },
  { text: "Depósito", value: "deposito" },
]

type Aprovado = {
  observacao: string
  andamento: string
  formaPagamento: string
  valorAprovado: number
}

export type PayloadAprovacao = Aprovado & {
  statusNovo: SinistroStatusEnum
}

export function AprovadoModal({
  open,
  onClose,
  onConfirm,
  sinistroId,
  sinistroNumero,
}: Props) {
  const [formData, setFormData] = useState<Aprovado>({
    observacao: "",
    andamento: "",
    formaPagamento: "",
    valorAprovado: 0,
  })

  const handleClose = () => {
    setFormData({
      observacao: "",
      andamento: "",
      formaPagamento: "",
      valorAprovado: 0,
    })
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.valorAprovado <= 0) {
      toast.error("Valor aprovado é obrigatório")
      return
    }

    if (!formData.formaPagamento || formData.formaPagamento.trim() === "") {
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
        statusNovo: SinistroStatusEnum.APROVADO,
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
          <strong>Objetivo:</strong> Aprovar ou reprovar o sinistro
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Andamento</label>
          <input
            type="text"
            value={formData.andamento}
            onChange={(e) =>
              setFormData({
                ...formData,
                andamento: e.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor Aprovado *
          </label>
          <Currency
            value={formData.valorAprovado || 0}
            onChange={(value) =>
              setFormData({
                ...formData,
                valorAprovado: value,
              })
            }
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Valor em R$"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Forma de Pagamento *
          </label>
          <AutocompleteInput
            options={formaPagamentoOptions}
            label=""
            field_name="formaPagamento"
            onChange={(e) =>
              setFormData({
                ...formData,
                formaPagamento: e.target.value,
              })
            }
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
