"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

interface CancelarApoliceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    dataCancelamento: string
    motivoCancelamento: string
  }) => Promise<void>
}

export function CancelarApoliceModal({
  open,
  onClose,
  onConfirm,
}: CancelarApoliceModalProps) {
  const [dataCancelamento, setDataCancelamento] = useState("")
  const [motivoCancelamento, setMotivoCancelamento] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!dataCancelamento || !motivoCancelamento) {
      return
    }
    setLoading(true)
    await onConfirm({ dataCancelamento, motivoCancelamento })
    setLoading(false)
    setDataCancelamento("")
    setMotivoCancelamento("")
  }

  const handleClose = () => {
    setDataCancelamento("")
    setMotivoCancelamento("")
    onClose()
  }

  return (
    <Modal
      title="Cancelar Apólice"
      content=""
      onClose={handleClose}
      open={open}>
      <div className="flex flex-col gap-4">
        <Input.Root>
          <label>Data de Cancelamento</label>
          <Input.Control
            type="date"
            value={dataCancelamento}
            onChange={(e) => setDataCancelamento(e.target.value)}
          />
        </Input.Root>

        <Input.Root>
          <label>Motivo do Cancelamento</label>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={4}
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
          />
        </Input.Root>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleConfirm}
            variant="secondary"
            disabled={loading}>
            {loading ? "Processando..." : "Confirmar Cancelamento"}
          </Button>
          <Button onClick={handleClose} variant="tertiary" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
