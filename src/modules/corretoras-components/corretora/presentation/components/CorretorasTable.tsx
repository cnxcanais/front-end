"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { removeCorretora } from "@/modules/corretoras-components/corretora/infra/remote"
import { useGrupoEconomicoQuery } from "@/modules/grupos-economicos-components/grupos-economicos/infra/hooks/use-grupo-economico-query"
import { FileXls, Paperclip, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
export function CorretorasTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useCorretoraQuery(page, limit, filters)
  const { data: gruposEconomicos } = useGrupoEconomicoQuery(1, 100)
  const corretoras = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/corretoras/edit/${id}`)
  }

  const filterFields: FilterField[] = [
    {
      name: "razaoSocial",
      label: "Razão Social",
      placeholder: "Buscar por razão social",
    },
    {
      name: "nomeFantasia",
      label: "Nome Fantasia",
      placeholder: "Buscar por rome fantasia",
    },
    { name: "cnpj", label: "CNPJ", placeholder: "Buscar por CNPJ" },
    { name: "uf", label: "UF", placeholder: "Buscar por UF" },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeCorretora(id)
      toast.success("Corretora removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Razão Social", accessor: "razaoSocial" },
    { header: "Nome Fantasia", accessor: "nomeFantasia" },
    { header: "CNPJ/CPF", accessor: "cnpjCpfFormatado" },
    {
      header: "Grupo Economico",
      accessor: "grupoEconomicoId",
      render: (value: string) => {
        const grupo = gruposEconomicos?.data?.find((c) => c.id === value)
        return grupo?.nome || value
      },
    },
    { header: "Email", accessor: "email" },
    {
      header: "Telefone",
      accessor: "telefone",
      render: (value: string) => <span> {formatPhoneNumber(value)}</span>,
    },
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

  useEffect(() => {
    if (corretoras.length > 0)
      setFilteredResults(
        corretoras.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial))
      )
  }, [corretoras])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Corretora"
        content="Você tem certeza de que deseja remover esta corretora?"
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
            onClick={() => push("/corretoras/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {corretoras.length > 0 && (
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

      {corretoras.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma corretora cadastrada.
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
