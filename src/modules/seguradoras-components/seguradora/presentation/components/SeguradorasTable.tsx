"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterForm, FilterField } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { removeSeguradora } from "@/modules/seguradoras-components/seguradora/infra/remote"
import { FileXls, Paperclip, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function SeguradorasTable() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useSeguradoraQuery(page, limit, filters)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const seguradoras = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/seguradoras/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeSeguradora(id)
      toast.success("Seguradora removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const filterFields: FilterField[] = [
    { name: "razaoSocial", label: "Razão Social", placeholder: "Buscar por razão social" },
    { name: "cnpj", label: "CNPJ", placeholder: "Buscar por CNPJ" },
    { name: "uf", label: "UF", placeholder: "Buscar por UF" },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const columns = [
    { header: "Razão Social", accessor: "razaoSocial" },
    { header: "Nome Fantasia", accessor: "fantasia" },
    { header: "Documento", accessor: "cnpjFormatado" },
    { header: "Endereço", accessor: "enderecoCompleto" },
    { header: "Cidade", accessor: "cidade" },
    { header: "UF", accessor: "uf" },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
          />
          <Paperclip
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
          />
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Seguradora"
        content="Você tem certeza de que deseja remover esta seguradora?"
        onClose={() => setOpen(false)}
        open={open}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmDelete} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>
      <FilterForm fields={filterFields} onFilter={handleFilter} />
      
      {Object.keys(filters).filter(key => filters[key]).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(filters)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              const field = filterFields.find(f => f.name === key)
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm">
                  <span className="font-medium">{field?.label}:</span>
                  <span>{value}</span>
                  <button
                    onClick={() => {
                      const newFilters = { ...filters }
                      delete newFilters[key]
                      setFilters(newFilters)
                      setPage(1)
                    }}
                    className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </div>
              )
            })}
        </div>
      )}
      
      <div className="mt-8 flex items-center justify-between">
        <Button
          onClick={() => push("/seguradoras/create")}
          variant="secondary">
          Cadastrar
        </Button>
        {seguradoras.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename="meu-relatorio"
              options={{ orientation: "portrait" }}
              title="Fornecedores"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={exportNoPagination}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {seguradoras.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum fornecedor cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={seguradoras} />
          <div className="md-2 mt-0 flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded px-3 py-1 text-sm enabled:hover:bg-gray-100 disabled:opacity-50">
              Anterior
            </button>
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded px-3 py-1 text-sm enabled:hover:bg-gray-100 disabled:opacity-50">
              Próxima
            </button>
          </div>
        </>
      }
    </>
  )
}
