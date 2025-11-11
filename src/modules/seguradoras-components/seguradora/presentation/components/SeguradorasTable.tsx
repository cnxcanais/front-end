"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { removeSeguradora } from "@/modules/seguradoras-components/seguradora/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function SeguradorasTable() {
  const { data: seguradoras, isLoading, refetch } = useSeguradoraQuery()
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const [filteredResults, setFilteredResults] = useState([])

  // handlers for Delete and Edit
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

  // column structure for table
  const columns = [
    { header: "Nome", accessor: "razaoSocial" },
    {
      header: "Documento",
      accessor: "cnpjFormatado",
    },
    {
      header: "Endereço",
      accessor: "enderecoCompleto",
    },
    {
      header: "Cidade",
      accessor: "cidade",
    },
    {
      header: "UF",
      accessor: "uf",
    },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string, row: unknown) => (
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

  // updates filteredResults when suppliers changes
  useEffect(() => {
    if (seguradoras) setFilteredResults(seguradoras)
  }, [seguradoras, isLoading])

  if (!seguradoras || isLoading) return <LoadingScreen />

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
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={seguradoras}
            searchParam="razaoSocial"
            onSearchResult={setFilteredResults}
          />

          <Button
            onClick={() => push("/seguradoras/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
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
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
