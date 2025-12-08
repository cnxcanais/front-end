"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Dispatch, SetStateAction } from "react"

type Props = {
  numParcelasInput: string
  setNumParcelasInput: Dispatch<SetStateAction<string>>
  setShowParcelasModal: Dispatch<SetStateAction<boolean>>
  handleGenerateParcelas: () => void
}

export function ParcelasModal({
  numParcelasInput,
  setNumParcelasInput,
  setShowParcelasModal,
  handleGenerateParcelas,
}: Props) {
  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Gerar Parcelas</h3>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Quantidade de parcelas
          </label>
          <Input.Root className="mt-2">
            <Input.Control
              type="number"
              min="1"
              value={numParcelasInput}
              onChange={(e) => setNumParcelasInput(e.target.value)}
              placeholder="Digite o número de parcelas"
              autoFocus
            />
          </Input.Root>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setShowParcelasModal(false)
              setNumParcelasInput("")
            }}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateParcelas}>Gerar</Button>
        </div>
      </div>
    </div>
  )
}
