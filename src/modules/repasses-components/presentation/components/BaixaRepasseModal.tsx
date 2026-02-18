"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { useState } from "react"

type Props = {
  repasse: Repasse.Type
  onClose: () => void
  onConfirm: (id: string, dataPagamento: string) => void
}

export function BaixaRepasseModal({ repasse, onClose, onConfirm }: Props) {
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = () => {
    onConfirm(repasse.id, dataPagamento)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Baixar Repasse</h3>
        
        <div className="mb-4 space-y-2 rounded bg-gray-50 p-3 text-sm">
          <div><strong>Valor Repasse:</strong> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(repasse.valorRepasse)}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Data Pagamento *</label>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar Baixa</Button>
        </div>
      </div>
    </div>
  )
}
