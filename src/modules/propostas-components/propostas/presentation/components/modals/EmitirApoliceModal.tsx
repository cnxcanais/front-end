"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

interface EmitirApoliceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    dataEmissao: string
    numeroApolice: string
    inicioVigencia: string
    fimVigencia: string
  }) => Promise<void>
}

export function EmitirApoliceModal({
  open,
  onClose,
  onConfirm,
}: EmitirApoliceModalProps) {
  const [dataEmissao, setDataEmissao] = useState("")
  const [numeroApolice, setNumeroApolice] = useState("")
  const [inicioVigencia, setInicioVigencia] = useState("")
  const [fimVigencia, setFimVigencia] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!dataEmissao || !numeroApolice || !inicioVigencia || !fimVigencia) {
      return
    }
    setLoading(true)
    await onConfirm({ dataEmissao, numeroApolice, inicioVigencia, fimVigencia })
    setLoading(false)
    setDataEmissao("")
    setNumeroApolice("")
    setInicioVigencia("")
    setFimVigencia("")
  }

  const handleClose = () => {
    setDataEmissao("")
    setNumeroApolice("")
    setInicioVigencia("")
    setFimVigencia("")
    onClose()
  }

  return (
    <Modal title="Emitir Apólice" content="" onClose={handleClose} open={open}>
      <div className="flex flex-col gap-4">
        <Input.Root>
          <label>Data de Emissão</label>
          <Input.Control
            type="date"
            value={dataEmissao}
            onChange={(e) => setDataEmissao(e.target.value)}
          />
        </Input.Root>

        <Input.Root>
          <label>Número da Apólice</label>
          <Input.Control
            type="text"
            value={numeroApolice}
            onChange={(e) => setNumeroApolice(e.target.value)}
          />
        </Input.Root>

        <Input.Root>
          <label>Início da Vigência</label>
          <Input.Control
            type="date"
            value={inicioVigencia}
            onChange={(e) => {
              setInicioVigencia(e.target.value)
              const date = new Date(e.target.value)
              date.setFullYear(date.getFullYear() + 1)
              setFimVigencia(date.toISOString().split("T")[0])
            }}
          />
        </Input.Root>

        <Input.Root>
          <label>Fim da Vigência</label>
          <Input.Control
            type="date"
            value={fimVigencia}
            onChange={(e) => setFimVigencia(e.target.value)}
          />
        </Input.Root>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleConfirm}
            variant="secondary"
            disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
          <Button onClick={handleClose} variant="tertiary" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
