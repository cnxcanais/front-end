"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { SelectInput } from "@/core/components/SelectInput"
import { baixarComissao } from "@/modules/comissoes-components/comissao/infra/remote"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
  onSuccess: () => void
}

export function BaixaComissaoModal({
  open,
  onClose,
  comissao,
  onSuccess,
}: Props) {
  const [valorPago, setValorPago] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [metodo, setMetodo] = useState<Comissao.Metodo>("Manual")
  const [observacao, setObservacao] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!comissao) return

    const valor = parseFloat(valorPago)
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor inválido")
      return
    }

    if (valor > comissao.valorPendente) {
      toast.error("Valor não pode ser maior que o pendente")
      return
    }

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
      await baixarComissao({
        comissaoId: comissao.id,
        valorPago: valor,
        dataPagamento,
        metodo,
        observacao: observacao || undefined,
      })
      toast.success("Baixa realizada com sucesso")
      onSuccess()
      onClose()
      setValorPago("")
      setDataPagamento("")
      setObservacao("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao realizar baixa")
    } finally {
      setLoading(false)
    }
  }

  if (!comissao) return null

  return (
    <Modal
      title="Baixa de Comissão"
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
              <span className="font-medium">Comissão Total:</span>{" "}
              {comissao.comissaoTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div>
              <span className="font-medium">Pago:</span>{" "}
              {comissao.valorPago.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div>
              <span className="font-medium">Pendente:</span>{" "}
              {comissao.valorPendente.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor Pago *
          </label>
          <Input.Root>
            <Input.Control
              type="number"
              step="0.01"
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              placeholder="0.00"
            />
          </Input.Root>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Data Pagamento *
          </label>
          <Input.Root>
            <Input.Control
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </Input.Root>
        </div>

        <div>
          <SelectInput
            label="Método *"
            field_name="metodo"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value as Comissao.Metodo)}
            options={[
              { text: "Manual", value: "Manual" },
              { text: "Lote", value: "Lote" },
              { text: "Importado", value: "Importado" },
            ]}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Observação</label>
          <textarea
            className="w-full rounded border border-gray-300 p-2 text-sm"
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Observações sobre o pagamento..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Baixa"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
