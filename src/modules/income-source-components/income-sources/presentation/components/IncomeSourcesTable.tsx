"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  getIncomeSources,
  removeIncomeSource,
} from "@/modules/income-source-components/income-sources/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeSourcesTable() {
  // TODO: fix accountId variable to be fetched from cookies or another aux function
  const account_id = process.env.NEXT_PUBLIC_ACCOUNT_ID

  const { data: incomeSources, isLoading } = useQuery({
    queryKey: ["income-sources"],
    queryFn: () => getIncomeSources({ account_id }),
    enabled: !!account_id,
  })

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const { income_sources_create, income_sources_edit, income_sources_delete } =
    JSON.parse(getCookie("permissions")).componentAccess

  const [filteredResults, setFilteredResults] = useState([])

  const refetchIncomeSourcesFn = useMutation({
    mutationFn: getIncomeSources,
    onSuccess: () => {
      toast.success("Fonte de receita removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover fonte de receita: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  // handlers for Delete and Edit
  const handleEdit = (id: string) => {
    push(`/income-sources/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeIncomeSource({ income_source_id: id }).then(() =>
      refetchIncomeSourcesFn.mutate({ account_id })
    )
  }

  // column structure for table
  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Documento",
      accessor: "cpf_cnpj",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Cidade",
      accessor: "city",
    },
    {
      header: "UF",
      accessor: "state",
    },
    {
      header: "Contato",
      accessor: "contact_name",
    },
    {
      header: "Telefone",
      accessor: "phone",
    },
    {
      header: "Endereço",
      accessor: "address_1",
    },
    {
      header: "Ações",
      accessor: "income_source_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {income_sources_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {income_sources_delete && (
            <Trash
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => {
                setId(value)
                setOpen(true)
              }}
            />
          )}
        </div>
      ),
    },
  ]

  // updates filteredResults when incomeSources changes
  useEffect(() => {
    if (incomeSources) setFilteredResults(incomeSources)
  }, [incomeSources, isLoading])

  // TODO: replace Loading with proper component
  if (!incomeSources || isLoading) return <>Loading</>

  return (
    <>
      <Modal
        title="Remover Fonte de Receita"
        content="Você tem certeza de que deseja remover esta fonte de receita?"
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
        <div className="flex gap-4">
          <SearchInput
            data={incomeSources}
            searchParam="name"
            onSearchResult={setFilteredResults}
          />
          {income_sources_create && (
            <Button
              onClick={() => push("/income-sources/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        <Button className="flex items-center gap-1" variant="secondary">
          <FileXls size={22} />
          Exportar
        </Button>
      </div>

      {filteredResults.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma fonte de receita cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
