"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { useState } from "react"
import { toast } from "sonner"

type Props = Readonly<{
  repasse: Repasse.Type
  onClose: () => void
  onConfirm: (id: string, novoValor: number) => void
}>

export function EditarValorRepasseModal({
  repasse,
  onClose,
  onConfirm,
}: Props) {
  const [novoValor, setNovoValor] = useState(repasse.valorRepasse)

  const handleSubmit = () => {
    if (novoValor <= 0) {
      toast.error("Valor inválido")
      return
    }
    onConfirm(repasse.id, novoValor)
  }

  return (
    <div className="bg-black/50 fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Editar Valor do Repasse</h3>

        <div className="mb-4 space-y-2 rounded bg-gray-50 p-3 text-sm">
          <div>
            <strong>Valor Atual:</strong>{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(repasse.valorRepasse)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="novo-valor"
              className="mb-1 block text-sm font-medium">
              Novo Valor *
            </label>
            <input
              id="novo-valor"
              type="number"
              value={novoValor}
              onChange={(e) => setNovoValor(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </div>
      </div>
    </div>
  )
}
