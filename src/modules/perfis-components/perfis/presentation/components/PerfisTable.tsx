"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { usePerfilQuery } from "../../infra/hooks/use-perfil-query"
import { removePerfil } from "../../infra/remote"

export function PerfisTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = usePerfilQuery()
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const perfis = data?.data || []

  const handleEdit = (id: string) => {
    push(`/perfis/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removePerfil(id)
      toast.success("Perfil removido com sucesso!")
      refetch()
    } catch (error) {
      const message = error?.response?.data?.message || "Erro ao remover perfil"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Descrição", accessor: "descricao" },
    {
      header: "Sistema",
      accessor: "isSistema",
      render: (value: boolean) => (value ? "Sim" : "Não"),
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
      name: "nome",
      label: "Nome",
      placeholder: "Buscar por nome",
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (perfis.length > 0) setFilteredResults(perfis)
  }, [perfis])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Perfil"
        content="Você tem certeza de que deseja remover este perfil?"
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
            onClick={() => push("/grupos-economicos/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {perfis.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`perfis.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Perfis"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("perfis")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {perfis.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum perfil cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={filteredResults} />
        </>
      }
    </>
  )
}
