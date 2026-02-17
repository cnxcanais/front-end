"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"
import { useReverterEstornoComissaoMutation } from "../../../infra/hooks/use-estorno-query"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
  onSuccess: () => void
}

export function ReverterEstornoComissaoModal({
  open,
  onClose,
  comissao,
  onSuccess,
}: Props) {
  const [motivo, setMotivo] = useState("")
  const [confirmado, setConfirmado] = useState(false)

  const reverterMutation = useReverterEstornoComissaoMutation()

  const handleSubmit = async () => {
    if (!comissao) return

    if (!motivo.trim() || motivo.trim().length < 10) {
      toast.error("Motivo deve ter no mínimo 10 caracteres")
      return
    }

    if (!confirmado) {
      toast.error("Confirme a operação marcando a caixa de confirmação")
      return
    }

    try {
      await reverterMutation.mutateAsync({
        estornoIds: [comissao.id],
        motivo: motivo.trim(),
      })
      toast.success("Estorno revertido com sucesso")
      onSuccess()
      handleClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao reverter estorno")
    }
  }

  const handleClose = () => {
    setMotivo("")
    setConfirmado(false)
    onClose()
  }

  if (!comissao) return null

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <Modal
      title="Reverter Estorno de Comissão"
      open={open}
      onClose={handleClose}
      size="medium">
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-700">
            Dados do Estorno
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Apólice:</span> {comissao.numeroApolice}
            </div>
            <div>
              <span className="font-medium">Parcela:</span> {comissao.numeroParcela}
            </div>
            <div>
              <span className="font-medium">Valor Estornado:</span>{" "}
              {formatCurrency(Math.abs(comissao.valorComissao))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Motivo da Reversão (mínimo 10 caracteres) *
          </label>
          <textarea
            className="w-full rounded border border-gray-300 p-2 text-sm"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: Estorno realizado por engano, corrigindo operação..."
            required
          />
        </div>

        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3">
          <p className="text-sm font-semibold text-yellow-900">
            ⚠️ Atenção:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-yellow-800">
            <li>Esta operação criará um lançamento positivo anulando o estorno</li>
            <li>O estorno será marcado como revertido para evitar dupla reversão</li>
            <li>Apenas usuários MASTER podem reverter estornos</li>
          </ul>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
          />
          <span className="text-sm font-medium">
            Confirmo que li os alertas e desejo reverter o estorno
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!confirmado || reverterMutation.isPending}>
            {reverterMutation.isPending ? "Processando..." : "Reverter Estorno"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
