"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { ImportErrors } from "@/modules/propostas-components/types/importErrors"

interface ImportErrorsModalProps {
  detalheErros: ImportErrors
  open: boolean
  onClose: () => void
}

export function ImportErrorsModal({
  open,
  onClose,
  detalheErros,
}: ImportErrorsModalProps) {
  const handleClose = () => {
    onClose()
  }

  const columns = [
    { header: "Linha", accessor: "linha" },
    { header: "Mensagem", accessor: "mensagem" },
  ]

  return (
    <Modal
      size="xlarge"
      title="Erros ao Importar Propostas"
      onClose={handleClose}
      open={open}>
      <div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            <label className="text-sm font-medium text-gray-700">
              Encontrados{" "}
              <span className="font-bold text-red-600">
                {detalheErros?.erros} erros
              </span>{" "}
              no upload do arquivo
            </label>
          </label>

          {detalheErros?.detalhesErros?.length > 0 && (
            <Table
              columns={columns}
              data={detalheErros?.detalhesErros}
              id="errorsTable"
            />
          )}
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={handleClose} variant="tertiary">
            Cancelar
          </Button>
          <ExportTableToPDFButton
            filename={`erros.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
            title="Erros de Importação de Apólices"
            tableId="errorsTable">
            Exportar
          </ExportTableToPDFButton>
        </div>
      </div>
    </Modal>
  )
}
