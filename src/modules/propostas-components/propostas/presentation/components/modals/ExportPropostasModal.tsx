"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { SelectInput } from "@/core/components/SelectInput"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import * as Input from "@/core/components/Input"
import { useState } from "react"

interface ExportPropostasModalProps {
  open: boolean
  onClose: () => void
  onExport: (filters: Record<string, string>) => void
  seguradosOptions: { label: string; value: string }[]
  corretorasOptions: { label: string; value: string }[]
  produtoresOptions: { label: string; value: string }[]
  seguradoresOptions: { label: string; value: string }[]
  ramosOptions: { label: string; value: string }[]
  produtosOptions: { label: string; value: string }[]
}

export function ExportPropostasModal({
  open,
  onClose,
  onExport,
  seguradosOptions,
  corretorasOptions,
  produtoresOptions,
  seguradoresOptions,
  ramosOptions,
  produtosOptions,
}: ExportPropostasModalProps) {
  const [exportFilters, setExportFilters] = useState<Record<string, string>>({})

  const handleExport = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(exportFilters).filter(([_, v]) => v !== "")
    )
    onExport(cleanFilters)
    setExportFilters({})
    onClose()
  }

  return (
    <Modal
      title="Exportar Propostas"
      onClose={onClose}
      open={open}
      size="large">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <AutocompleteInput
          label="Segurado"
          field_name="seguradoId"
          value={exportFilters.seguradoId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, seguradoId: e.target.value })
          }
          options={seguradosOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <AutocompleteInput
          label="Corretora"
          field_name="corretoraId"
          value={exportFilters.corretoraId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, corretoraId: e.target.value })
          }
          options={corretorasOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <AutocompleteInput
          label="Produtor"
          field_name="produtorId"
          value={exportFilters.produtorId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, produtorId: e.target.value })
          }
          options={produtoresOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <AutocompleteInput
          label="Seguradora"
          field_name="seguradoraId"
          value={exportFilters.seguradoraId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, seguradoraId: e.target.value })
          }
          options={seguradoresOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <AutocompleteInput
          label="Ramo"
          field_name="ramoId"
          value={exportFilters.ramoId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, ramoId: e.target.value })
          }
          options={ramosOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <AutocompleteInput
          label="Produto"
          field_name="produtoId"
          value={exportFilters.produtoId || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, produtoId: e.target.value })
          }
          options={produtosOptions.map(o => ({ text: o.label, value: o.value }))}
        />
        <SelectInput
          label="Tipo de Documento"
          field_name="tipoDocumento"
          value={exportFilters.tipoDocumento || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, tipoDocumento: e.target.value })
          }
          options={[
            { text: "Todos", value: "" },
            { text: "Proposta", value: "Proposta" },
            { text: "Apólice", value: "Apólice" },
            { text: "Renovação", value: "Renovação" },
            { text: "Endosso", value: "Endosso" },
          ]}
        />
        <SelectInput
          label="Origem"
          field_name="origem"
          value={exportFilters.origem || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, origem: e.target.value })
          }
          options={[
            { text: "Todos", value: "" },
            { text: "Manual", value: "Manual" },
            { text: "Importação", value: "Importação" },
            { text: "Integração", value: "Integração" },
          ]}
        />
        <SelectInput
          label="Situação"
          field_name="situacao"
          value={exportFilters.situacao || ""}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, situacao: e.target.value })
          }
          options={[
            { text: "Todos", value: "" },
            { text: "Ativo", value: "Ativo" },
            { text: "Inativo", value: "Inativo" },
          ]}
        />
        <div>
          <label>Número da Proposta</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.numeroProposta || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, numeroProposta: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Número da Apólice</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.numeroApolice || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, numeroApolice: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Número do Endosso</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.numeroEndosso || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, numeroEndosso: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Placa do Veículo</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.placaVeiculo || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, placaVeiculo: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Chassi do Veículo</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.chassiVeiculo || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, chassiVeiculo: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Vigência Inicial (De)</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="date"
              value={exportFilters.inicioVigenciaMin || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, inicioVigenciaMin: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Vigência Inicial (Até)</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="date"
              value={exportFilters.inicioVigenciaMax || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, inicioVigenciaMax: e.target.value })
              }
            />
          </Input.Root>
        </div>
        <div>
          <label>Busca Geral</label>
          <Input.Root className="mt-2">
            <Input.Control
              value={exportFilters.search || ""}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, search: e.target.value })
              }
            />
          </Input.Root>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onClose} variant="tertiary">
          Cancelar
        </Button>
        <Button onClick={handleExport} variant="secondary">
          Exportar
        </Button>
      </div>
    </Modal>
  )
}
