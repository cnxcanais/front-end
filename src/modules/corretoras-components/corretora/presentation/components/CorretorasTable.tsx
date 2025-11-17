"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { removeCorretora } from "@/modules/corretoras-components/corretora/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function CorretorasTable() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading, refetch } = useCorretoraQuery(page, limit)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const corretoras = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/corretoras/edit/${id}`)
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
    { header: "Email", accessor: "email" },
    { header: "Telefone", accessor: "telefone" },
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
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (corretoras.length > 0) setFilteredResults(corretoras)
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
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={corretoras}
            searchParam="razaoSocial"
            onSearchResult={setFilteredResults}
          />
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

      {corretoras.length == 0 ? (
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma corretora cadastrada.
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
