"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTipoSinistroQuery } from "../../infra/hooks/use-tipo-sinistro-query"
import { removeTipoSinistro } from "../../infra/remote"

export function TiposSinistrosTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useTipoSinistroQuery(
    page,
    limit,
    filters
  )
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const tiposSinistros = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/tipos-sinistros/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeTipoSinistro(id)
      toast.success("Tipo de sinistro removido com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover tipo de sinistro"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Descrição", accessor: "descricao" },
    {
      header: "Ramo",
      accessor: "ramo",
      render: (value: { descricao: string }) => value?.descricao || "-",
    },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
            color="#00dfa7"
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
            color="#00dfa7"
          />
        </div>
      ),
    },
  ]

  const filterFields: FilterField[] = [
    {
      name: "descricao",
      label: "Descrição",
      placeholder: "Buscar por descrição",
    },
    {
      name: "ramoId",
      label: "Ramo ID",
      placeholder: "Buscar por ramo",
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (tiposSinistros.length > 0) setFilteredResults(tiposSinistros)
  }, [tiposSinistros])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Tipo de Sinistro"
        content="Você tem certeza de que deseja remover este tipo de sinistro?"
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
            onClick={() => push("/tipos-sinistros/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {tiposSinistros.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`tipos-sinistros.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Tipos de Sinistros"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("tipos-sinistros")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {tiposSinistros.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum tipo de sinistro cadastrado.
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
