"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { marcarComoPaga } from "@/modules/comissoes-components/comissao/infra/remote"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
  onSuccess: () => void
}

export function PagarComissaoModal({
  open,
  onClose,
  comissao,
  onSuccess,
}: Props) {
  const [dataPagamento, setDataPagamento] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!comissao) return

    if (!dataPagamento) {
      toast.error("Data de pagamento é obrigatória")
      return
    }

    const dataInformada = new Date(dataPagamento)
    const hoje = new Date()
    if (dataInformada > hoje) {
      toast.error("Data de pagamento não pode ser futura")
      return
    }

    setLoading(true)
    try {
      await marcarComoPaga(comissao.id, { dataPagamento })
      toast.success("Comissão marcada como paga")
      onSuccess()
      onClose()
      setDataPagamento("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao marcar como paga")
    } finally {
      setLoading(false)
    }
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
      title="Marcar Comissão como Paga"
      open={open}
      onClose={onClose}
      size="medium">
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-700">
            Dados da Comissão
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Segurado:</span> {comissao.seguradoNome}
            </div>
            <div>
              <span className="font-medium">Apólice:</span> {comissao.numeroApolice}
            </div>
            <div>
              <span className="font-medium">Parcela:</span> {comissao.numeroParcela}
            </div>
            <div>
              <span className="font-medium">Valor:</span>{" "}
              {formatCurrency(comissao.valorComissao)}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Data de Pagamento *
          </label>
          <Input.Root>
            <Input.Control
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </Input.Root>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
