"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

interface EndossarApoliceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    dataEmissao: string
    numeroEndosso: string
    inicioVigencia: string
    fimVigencia: string
  }) => void
}

export function EndossarApoliceModal({
  open,
  onClose,
  onConfirm,
}: EndossarApoliceModalProps) {
  const [dataEmissao, setDataEmissao] = useState("")
  const [numeroEndosso, setNumeroEndosso] = useState("")
  const [inicioVigencia, setInicioVigencia] = useState("")
  const [fimVigencia, setFimVigencia] = useState("")

  const handleConfirm = () => {
    if (!dataEmissao || !numeroEndosso || !inicioVigencia || !fimVigencia) {
      return
    }
    onConfirm({ dataEmissao, numeroEndosso, inicioVigencia, fimVigencia })
    setDataEmissao("")
    setNumeroEndosso("")
    setInicioVigencia("")
    setFimVigencia("")
  }

  const handleClose = () => {
    setDataEmissao("")
    setNumeroEndosso("")
    setInicioVigencia("")
    setFimVigencia("")
    onClose()
  }

  return (
    <Modal title="Endossar Apólice" content="" onClose={handleClose} open={open}>
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
          <label>Número do Endosso</label>
          <Input.Control
            type="text"
            value={numeroEndosso}
            onChange={(e) => setNumeroEndosso(e.target.value)}
          />
        </Input.Root>

        <Input.Root>
          <label>Início da Vigência</label>
          <Input.Control
            type="date"
            value={inicioVigencia}
            onChange={(e) => setInicioVigencia(e.target.value)}
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
          <Button onClick={handleConfirm} variant="secondary">
            Confirmar Endosso
          </Button>
          <Button onClick={handleClose} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
