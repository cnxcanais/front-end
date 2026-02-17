"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"
import { useEstornoComissaoMutation } from "../../../infra/hooks/use-estorno-query"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
  onSuccess: () => void
}

export function EstornoComissaoModal({
  open,
  onClose,
  comissao,
  onSuccess,
}: Props) {
  const [valorEstorno, setValorEstorno] = useState("")
  const [motivo, setMotivo] = useState("")
  const [confirmado, setConfirmado] = useState(false)

  const estornoMutation = useEstornoComissaoMutation()

  const handleSubmit = async () => {
    if (!comissao) return

    const valor = parseFloat(valorEstorno)
    if (!valor || valor <= 0) {
      toast.error("Valor inválido")
      return
    }

    if (valor > comissao.valorPago) {
      toast.error("Valor não pode ser maior que o valor pago")
      return
    }

    if (!motivo.trim() || motivo.trim().length < 10) {
      toast.error("Motivo deve ter no mínimo 10 caracteres")
      return
    }

    if (!confirmado) {
      toast.error("Confirme a operação marcando a caixa de confirmação")
      return
    }

    try {
      await estornoMutation.mutateAsync({
        registros: [
          {
            registroOriginalId: comissao.id,
            valorEstorno: valor,
          },
        ],
        motivo: motivo.trim(),
      })
      toast.success("Estorno realizado com sucesso")
      onSuccess()
      handleClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao executar estorno")
    }
  }

  const handleClose = () => {
    setValorEstorno("")
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
      title="Estornar Comissão"
      open={open}
      onClose={handleClose}
      size="medium">
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-700">
            Dados da Comissão
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Apólice:</span> {comissao.numeroApolice}
            </div>
            <div>
              <span className="font-medium">Parcela:</span> {comissao.numeroParcela}
            </div>
            <div>
              <span className="font-medium">Valor Pago:</span>{" "}
              {formatCurrency(comissao.valorPago)}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor do Estorno (Máx: {formatCurrency(comissao.valorPago)}) *
          </label>
          <Input.Root>
            <Input.Control
              type="number"
              step="0.01"
              value={valorEstorno}
              onChange={(e) => setValorEstorno(e.target.value)}
              placeholder="0.00"
            />
          </Input.Root>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Motivo do Estorno (mínimo 10 caracteres) *
          </label>
          <textarea
            className="w-full rounded border border-gray-300 p-2 text-sm"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Descreva o motivo do estorno..."
            required
          />
        </div>

        <div className="rounded-lg border border-red-300 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-900">
            ⚠️ Atenção:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
            <li>Esta operação é irreversível</li>
            <li>Apenas usuários MASTER podem executar estornos</li>
            <li>Todos os registros devem pertencer à mesma apólice</li>
          </ul>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
          />
          <span className="text-sm font-medium">
            Confirmo que li os alertas e desejo executar o estorno
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!confirmado || estornoMutation.isPending}>
            {estornoMutation.isPending ? "Processando..." : "Executar Estorno"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
