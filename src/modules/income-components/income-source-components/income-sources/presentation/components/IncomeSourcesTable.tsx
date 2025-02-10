"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { useGetIncomeSourcesQuery } from "@/modules/income-components/income-source-components/income-sources/infra/hooks/use-get-income-sources-query"
import { removeIncomeSource } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeSourcesTable() {
  const account_id = getAccountId()

  const { data: incomeSources, isLoading } =
    useGetIncomeSourcesQuery(account_id)

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const income_sources_create = getPermissionByEntity("income_sources_create")
  const income_sources_edit = getPermissionByEntity("income_sources_edit")
  const income_sources_delete = getPermissionByEntity("income_sources_delete")

  const [filteredResults, setFilteredResults] = useState([])

  // handlers for Delete and Edit
  const handleEdit = (id: string) => {
    push(`/income-sources/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeIncomeSource(id)
      toast.success("Fonte de Receita removido com sucesso!")
    } catch (error) {
      toast.error("Erro ao remover Fonte de Receita: " + error)
    } finally {
      setOpen(false)
    }
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
      header: "Arquivos",
      accessor: "income_source_id",
      render: (value: string) => (
        <ModalFilesTrigger entityId={value} entityType={"income_source_id"} />
      ),
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

  if (!incomeSources || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Fonte de Receita"
        content="Você tem certeza de que deseja remover este Fonte de Receita?"
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
        {incomeSources.length > 0 && (
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        )}
      </div>

      {incomeSources.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma fonte de receita cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
