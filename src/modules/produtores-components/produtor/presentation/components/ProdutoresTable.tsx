"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { FileXls, Paperclip, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProdutoresTable() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading } = useProdutorQuery(page, limit)
  const { push } = useRouter()

  const [filteredResults, setFilteredResults] = useState([])

  const produtores = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/produtores/edit/${id}`)
  }

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "CPF/CNPJ", accessor: "cnpjCpf" },
    { header: "Situação", accessor: "situacao" },
    { header: "Email", accessor: "email" },
    { header: "Telefone", accessor: "telefoneCelular" },
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
    if (produtores.length > 0) setFilteredResults(produtores)
  }, [produtores])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={produtores}
            searchParam="nome"
            onSearchResult={setFilteredResults}
          />
          <Button
            onClick={() => push("/produtores/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {produtores.length > 0 && (
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

      {produtores.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum produtor cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={filteredResults} />
          <div className="mt-2 flex items-center justify-end gap-2">
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
