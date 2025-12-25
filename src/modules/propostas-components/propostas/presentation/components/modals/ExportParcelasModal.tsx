"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { SelectInput } from "@/core/components/SelectInput"
import { useState } from "react"

interface ExportParcelasModalProps {
  open: boolean
  onClose: () => void
  onExport: (filters: Record<string, string>) => void
}

export function ExportParcelasModal({
  open,
  onClose,
  onExport,
}: ExportParcelasModalProps) {
  const [situacao, setSituacao] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const handleExport = () => {
    const filters: Record<string, string> = {}
    if (situacao) filters.situacao = situacao
    if (dataInicio) filters.dataInicio = dataInicio
    if (dataFim) filters.dataFim = dataFim
    onExport(filters)
    onClose()
  }

  return (
    <Modal title="Exportar Parcelas" onClose={onClose} open={open}>
      <div className="mb-4 flex flex-col gap-4">
        <SelectInput
          label="Situação"
          field_name="parcelas"
          value={situacao}
          onChange={(e) => setSituacao(e.target.value)}
          options={[
            { text: "Todas", value: "" },
            { text: "Cancelada", value: "Cancelada" },
            { text: "Pendente", value: "Pendente" },
            { text: "Em Atraso", value: "Em Atraso" },
            { text: "Paga", value: "Paga" },
          ]}
        />
        <Input.Root>
          <label>Data Início</label>
          <Input.Control
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </Input.Root>
        <Input.Root>
          <label>Data Fim</label>
          <Input.Control
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </Input.Root>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button onClick={handleExport} variant="secondary">
          Exportar
        </Button>
        <Button onClick={onClose} variant="tertiary">
          Cancelar
        </Button>
      </div>
    </Modal>
  )
}
