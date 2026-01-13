"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (date: string) => void
  currentDate?: string
}

export function PrevisaoPagamentoModal({
  open,
  onClose,
  onConfirm,
  currentDate,
}: Props) {
  const [date, setDate] = useState(currentDate || "")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">
          Alterar Previsão de Pagamento
        </h3>
        <div>
          <label className="mb-2 block text-sm font-medium">Nova Data</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              autoFocus
            />
          </Input.Root>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (date) {
                onConfirm(date)
                onClose()
              }
            }}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}
