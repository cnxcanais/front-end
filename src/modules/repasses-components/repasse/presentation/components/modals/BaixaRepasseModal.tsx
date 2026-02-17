"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { SelectInput } from "@/core/components/SelectInput"
import { baixarRepasse } from "@/modules/repasses-components/repasse/infra/remote"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  repasse: Repasse.Type | null
  onSuccess: () => void
}

export function BaixaRepasseModal({
  open,
  onClose,
  repasse,
  onSuccess,
}: Props) {
  const [valorPago, setValorPago] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [metodo, setMetodo] = useState<Repasse.Metodo>("Manual")
  const [referenciaBancaria, setReferenciaBancaria] = useState("")
  const [observacao, setObservacao] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!repasse) return

    const valor = parseFloat(valorPago)
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor inválido")
      return
    }

    if (valor > repasse.valorPendente) {
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
      await baixarRepasse({
        repasseId: repasse.id,
        valorPago: valor,
        dataPagamento,
        metodo,
        referenciaBancaria: referenciaBancaria || undefined,
        observacao: observacao || undefined,
      })
      toast.success("Baixa realizada com sucesso")
      onSuccess()
      onClose()
      setValorPago("")
      setDataPagamento("")
      setReferenciaBancaria("")
      setObservacao("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao realizar baixa")
    } finally {
      setLoading(false)
    }
  }

  if (!repasse) return null

  return (
    <Modal
      title="Baixa de Repasse"
      open={open}
      onClose={onClose}
      size="medium">
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-700">
            Dados do Repasse
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Produtor:</span> {repasse.produtorNome}
            </div>
            <div>
              <span className="font-medium">Apólice:</span> {repasse.numeroApolice}
            </div>
            <div>
              <span className="font-medium">Parcela:</span> {repasse.numeroParcela}
            </div>
            <div>
              <span className="font-medium">Nível Cadeia:</span> {repasse.nivelCadeia}
            </div>
            <div>
              <span className="font-medium">Valor Total:</span>{" "}
              {repasse.valorTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div>
              <span className="font-medium">Pago:</span>{" "}
              {repasse.valorPago.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Pendente:</span>{" "}
              {repasse.valorPendente.toLocaleString("pt-BR", {
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
            onChange={(e) => setMetodo(e.target.value as Repasse.Metodo)}
            options={[
              { text: "Manual", value: "Manual" },
              { text: "Lote", value: "Lote" },
              { text: "Importado", value: "Importado" },
            ]}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Referência Bancária
          </label>
          <Input.Root>
            <Input.Control
              value={referenciaBancaria}
              onChange={(e) => setReferenciaBancaria(e.target.value)}
              placeholder="Número do comprovante, TED, etc."
            />
          </Input.Root>
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
