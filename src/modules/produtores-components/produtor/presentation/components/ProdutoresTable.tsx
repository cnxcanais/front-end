"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProdutoresTable() {
  const { data: produtores, isLoading } = useProdutorQuery()
  const { push } = useRouter()

  const [filteredResults, setFilteredResults] = useState([])

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
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (produtores) setFilteredResults(produtores)
  }, [produtores, isLoading])

  if (!produtores || isLoading) return <LoadingScreen />

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
      </div>

      {produtores.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum produtor cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
