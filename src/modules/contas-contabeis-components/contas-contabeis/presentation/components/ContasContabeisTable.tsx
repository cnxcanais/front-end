"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useContaContabilQuery } from "@/modules/contas-contabeis-components/contas-contabeis/infra/hooks/use-conta-contabil-query"
import { removeContaContabil } from "@/modules/contas-contabeis-components/contas-contabeis/infra/remote"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export function ContasContabeisTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useContaContabilQuery(
    page,
    limit,
    filters
  )
  const { data: corretoras, isLoading: isLoadingCorretoras } =
    useCorretoraQuery(1, -1)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const corretorasOptions = useMemo(() => {
    if (isLoadingCorretoras || !corretoras) return []
    return corretoras.data.map((corretora) => ({
      label: corretora.razaoSocial,
      value: corretora.id,
    }))
  }, [corretoras, isLoadingCorretoras])

  const contasContabeis = useMemo(() => data?.data || [], [data])
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/contas-contabeis/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeContaContabil(id)
      toast.success("Conta contábil removida com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover conta contábil"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Descrição", accessor: "descricao" },
    {
      header: "Corretora",
      accessor: "corretora",
      render: (value: { razaoSocial: string }) => value?.razaoSocial || "-",
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
      name: "codigo",
      label: "Código",
      placeholder: "Buscar por código",
    },
    {
      name: "descricao",
      label: "Descrição",
      placeholder: "Buscar por descrição",
    },
    {
      name: "corretoraId",
      label: "Corretora",
      placeholder: "Buscar por corretora",
      type: "select",
      options: corretorasOptions,
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (contasContabeis.length > 0) setFilteredResults(contasContabeis)
  }, [contasContabeis])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Conta Contábil"
        content="Você tem certeza de que deseja remover esta conta contábil?"
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
            onClick={() => push("/contas-contabeis/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {contasContabeis.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`contas-contabeis.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Contas Contábeis"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("contas-contabeis")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {contasContabeis.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma conta contábil cadastrada.
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
