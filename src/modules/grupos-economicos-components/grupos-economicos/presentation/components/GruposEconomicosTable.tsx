"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useGrupoEconomicoQuery } from "@/modules/grupos-economicos-components/grupos-economicos/infra/hooks/use-grupo-economico-query"
import { removeGrupoEconomico } from "@/modules/grupos-economicos-components/grupos-economicos/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function GruposEconomicosTable() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading, refetch } = useGrupoEconomicoQuery(page, limit)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const gruposEconomicos = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/grupos-economicos/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeGrupoEconomico(id)
      toast.success("Grupo Econômico removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "nome" },
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

  useEffect(() => {
    if (gruposEconomicos.length > 0) setFilteredResults(gruposEconomicos)
  }, [gruposEconomicos])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Grupo Econômico"
        content="Você tem certeza de que deseja remover este grupo econômico?"
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
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={gruposEconomicos}
            searchParam="nome"
            onSearchResult={setFilteredResults}
          />
          <Button
            onClick={() => push("/grupos-economicos/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {gruposEconomicos.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename="grupos-economicos"
              options={{ orientation: "portrait" }}
              title="Grupos Econômicos"
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

      {gruposEconomicos.length == 0 ? (
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum grupo econômico cadastrado.
        </h2>
      ) : (
        <>
          <Table columns={columns} data={filteredResults} />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded px-3 py-1 text-sm disabled:opacity-50 enabled:hover:bg-gray-100">
              Anterior
            </button>
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded px-3 py-1 text-sm disabled:opacity-50 enabled:hover:bg-gray-100">
              Próxima
            </button>
          </div>
        </>
      )}
    </>
  )
}
