"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

interface RenovarApoliceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    dataEmissao: string
    numeroApolice: string
    inicioVigencia: string
    fimVigencia: string
  }) => void
}

export function RenovarApoliceModal({
  open,
  onClose,
  onConfirm,
}: RenovarApoliceModalProps) {
  const [dataEmissao, setDataEmissao] = useState("")
  const [numeroApolice, setNumeroApolice] = useState("")
  const [inicioVigencia, setInicioVigencia] = useState("")
  const [fimVigencia, setFimVigencia] = useState("")

  const handleConfirm = () => {
    if (!dataEmissao || !numeroApolice || !inicioVigencia || !fimVigencia) {
      return
    }
    onConfirm({ dataEmissao, numeroApolice, inicioVigencia, fimVigencia })
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
    <Modal title="Renovar Apólice" content="" onClose={handleClose} open={open}>
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
            Confirmar Renovação
          </Button>
          <Button onClick={handleClose} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
