"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (justification: string) => void
  fromStatus: string
  toStatus: string
  sinistroNumero: string
}

export function BackwardJustificationModal({
  open,
  onClose,
  onConfirm,
  fromStatus,
  toStatus,
  sinistroNumero,
}: Props) {
  const [justification, setJustification] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!justification.trim() || justification.trim().length < 10) {
      toast.error("Justificativa é obrigatória e deve ter pelo menos 10 caracteres")
      return
    }

    onConfirm(justification)
    handleClose()
  }

  const handleClose = () => {
    setJustification("")
    onClose()
  }

  return (
    <Modal
      title={`Retornar Sinistro - ${sinistroNumero}`}
      open={open}
      onClose={handleClose}
      size="medium">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Atenção:</strong> Você está retornando o sinistro de{" "}
          <strong>{fromStatus}</strong> para <strong>{toStatus}</strong>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Justificativa *
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Explique o motivo de retornar este sinistro..."
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo de 10 caracteres
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Confirmar Retorno
          </Button>
        </div>
      </form>
    </Modal>
  )
}
