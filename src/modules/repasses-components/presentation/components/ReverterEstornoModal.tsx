"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { useState } from "react"
import { toast } from "sonner"

type Props = Readonly<{
  repasse: Repasse.Type
  onClose: () => void
  onConfirm: (estornoIds: string[], motivo: string) => void
}>

export function ReverterEstornoModal({ repasse, onClose, onConfirm }: Props) {
  const [motivo, setMotivo] = useState("")

  const handleSubmit = () => {
    if (!motivo.trim()) {
      toast.error("Motivo obrigatório")
      return
    }
    onConfirm([repasse.id], motivo)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Reverter Estorno</h3>
        
        <div className="mb-4 space-y-2 rounded bg-gray-50 p-3 text-sm">
          <div><strong>Valor:</strong> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(repasse.valorRepasse)}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="motivo-estorno" className="mb-1 block text-sm font-medium">Motivo *</label>
            <textarea
              id="motivo-estorno"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Descreva o motivo da reversão do estorno..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar Reversão</Button>
        </div>
      </div>
    </div>
  )
}
