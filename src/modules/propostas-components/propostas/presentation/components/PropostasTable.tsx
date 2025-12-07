"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useProposaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { removeProposta } from "@/modules/propostas-components/propostas/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function PropostasTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useProposaQuery(page, limit, filters)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const propostas = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/propostas/edit/${id}`)
  }

  const handleRowAction = (row: any) => {
    return row._id
  }

  const handleConfirmDelete = async () => {
    try {
      await removeProposta(id)
      toast.success("Proposta removida com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover proposta"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Número Proposta", accessor: "_numeroProposta" },
    { header: "Tipo Documento", accessor: "_tipoDocumento" },
    { header: "Origem", accessor: "_origem" },
    { header: "Situação", accessor: "_situacao" },
    { header: "Prêmio Líquido", accessor: "_premioLiquido" },
    { header: "Comissão", accessor: "_valorComissao" },
    { header: "Vigência Início", accessor: "_inicioVigencia" },
    { header: "Vigência Fim", accessor: "_fimVigencia" },
    {
      header: "Ações",
      accessor: "_id",
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
        </div>
      ),
    },
  ]

  const getIdFromRow = (row: any) => row._id

  const filterFields: FilterField[] = [
    {
      name: "_numeroProposta",
      label: "Número Proposta",
      placeholder: "Buscar por número",
    },
    {
      name: "_tipoDocumento",
      label: "Tipo Documento",
      placeholder: "Buscar por tipo",
      type: "select",
      options: [
        { label: "Proposta", value: "Proposta" },
        { label: "Apólice", value: "Apólice" },
        { label: "Renovação", value: "Renovação" },
        { label: "Endosso", value: "Endosso" },
      ],
    },
    {
      name: "_situacao",
      label: "Situação",
      placeholder: "Buscar por situação",
      type: "select",
      options: [
        { label: "Ativo", value: "Ativo" },
        { label: "Inativo", value: "Inativo" },
      ],
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (propostas.length > 0) setFilteredResults(propostas)
  }, [propostas])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Proposta"
        content="Você tem certeza de que deseja remover esta proposta?"
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

      <FilterForm
        fields={filterFields}
        onFilter={handleFilter}
        appliedFilters={filters}
      />

      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <Button
            onClick={() => push("/propostas/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {propostas.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`propostas.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "landscape" }}
              title="Propostas"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("propostas")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {propostas.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma proposta cadastrada.
        </h2>
      : <>
          <Table columns={columns} data={filteredResults} />
          <Pagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </>
      }
    </>
  )
}
