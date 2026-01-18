"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Usuario } from "@/@types/usuario"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import { Currency } from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { saveFile } from "@/core/components/Modals/ModalFiles/remote"
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

export type EmRegulacaoData = {
  responsavelUsuarioId: string
  valorEstimado: number
  laudoTecnico: File | null
  observacao: string
}

export type Payload = Omit<EmRegulacaoData, "laudoTecnico"> & {
  statusNovo: SinistroStatusEnum
}

export function EmRegulacaoModal({
  open,
  onClose,
  onConfirm,
  sinistroId,
  sinistroNumero,
  isAdmin,
  usuarios,
}: Props) {
  const [formData, setFormData] = useState<EmRegulacaoData>({
    responsavelUsuarioId: "",
    valorEstimado: 0,
    laudoTecnico: null,
    observacao: "",
  })

  const corretoraId = getCookie("corretoraId") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.responsavelUsuarioId ||
      formData.responsavelUsuarioId.trim() === ""
    ) {
      toast.error("Escolha o regulador responsável")
      return
    }

    if (formData.valorEstimado <= 0) {
      toast.error("Valor estimado é obrigatório")
      return
    }

    if (!formData.laudoTecnico) {
      toast.error("Laudo Técnico é obrigatório")
      return
    }

    if (formData.observacao.trim() === "") {
      toast.error("Parecer Técnico é obrigatório")
      return
    }

    try {
      // Update status with observacao if provided
      const payload: Payload = {
        statusNovo: SinistroStatusEnum.EM_REGULACAO,
        responsavelUsuarioId: formData.responsavelUsuarioId,
        valorEstimado: formData.valorEstimado,
        observacao: formData.observacao,
      }

      const response = await changeSinistroStatus(sinistroId, payload)

      if (!response.id) throw new Error(response.response?.data?.message)

      await queryClient.invalidateQueries({ queryKey: ["sinistro"] })

      // Upload files
      await saveFile({
        entity: "sinistro",
        entityId: sinistroId,
        files: [formData.laudoTecnico].filter(
          (file): file is File => file !== null
        ),
      })

      toast.success("Status atualizado com sucesso!")
      onConfirm()
      handleClose()
    } catch (error) {
      toast.error("Erro ao atualizar status: " + error?.response?.data?.message)
    }
  }

  const usuariosOptions =
    isAdmin ?
      usuarios?.data.map((user) => ({
        text: user.props.nome,
        value: user.props.id,
      }))
    : usuarios?.data
        .filter((user) => user.props.corretoraId === corretoraId)
        .map((user) => ({
          text: user.props.nome,
          value: user.props.id,
        }))

  const handleClose = () => {
    setFormData({
      responsavelUsuarioId: "",
      valorEstimado: 0,
      laudoTecnico: null,
      observacao: "",
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
