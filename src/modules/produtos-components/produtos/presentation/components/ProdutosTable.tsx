"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { removeProduto } from "@/modules/produtos-components/produtos/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export function ProdutosTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useProdutoQuery(page, limit, filters)
  const { data: ramos, isLoading: isLoadingRamos } = useRamoQuery(1, 100)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const ramosOptions = useMemo(() => {
    if (isLoadingRamos || !ramos) return []
    return ramos.data.map((ramo) => ({
      label: ramo.descricao,
      value: ramo.id,
    }))
  }, [ramos, isLoadingRamos])

  const produtos = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/produtos/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeProduto(id)
      toast.success("Produto removido com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover produto"
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

  const filterFields: FilterField[] = [
    {
      name: "descricao",
      label: "Descrição",
      placeholder: "Buscar por descrição",
    },
    {
      name: "ramoId",
      label: "Ramo",
      placeholder: "Buscar por ramo",
      type: "select",
      options: ramosOptions,
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (produtos.length > 0) setFilteredResults(produtos)
  }, [produtos])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Produto"
        content="Você tem certeza de que deseja remover este produto?"
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
            onClick={() => push("/produtos/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {produtos.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`produtos.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Produtos"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("produtos")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {produtos.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum produto cadastrado.
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
