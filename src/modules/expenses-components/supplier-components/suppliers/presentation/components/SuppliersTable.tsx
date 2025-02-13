"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { formatStaticDocument } from "@/core/utils/formatDocumentNumber"
import { formatStaticPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { useSupplierQuery } from "@/modules/expenses-components/supplier-components/suppliers/infra/hooks/use-supplier-query"
import { removeSupplier } from "@/modules/expenses-components/supplier-components/suppliers/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function SuppliersTable() {
  const account_id = getAccountId()

  const { data: suppliers, isLoading, refetch } = useSupplierQuery(account_id)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const suppliers_create = getPermissionByEntity("suppliers_create")
  const suppliers_edit = getPermissionByEntity("suppliers_edit")
  const suppliers_delete = getPermissionByEntity("suppliers_delete")

  const [filteredResults, setFilteredResults] = useState([])

  // handlers for Delete and Edit
  const handleEdit = (id: string) => {
    push(`/suppliers/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeSupplier(id)
      toast.success("Fornecedor removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
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
      render: (value: string, row: unknown) => (
        <p>{formatStaticDocument(value)}</p>
      ),
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
      render: (value: string) => <p>{formatStaticPhoneNumber(value)}</p>,
    },
    {
      header: "Endereço",
      accessor: "address_1",
    },
    {
      header: "Arquivos",
      accessor: "supplier_id",
      render: (value: string) => (
        <ModalFilesTrigger entityId={value} entityType={"supplier_id"} />
      ),
    },
    {
      header: "Ações",
      accessor: "supplier_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {suppliers_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {suppliers_delete && (
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

  // updates filteredResults when suppliers changes
  useEffect(() => {
    if (suppliers) setFilteredResults(suppliers)
  }, [suppliers, isLoading])

  if (!suppliers || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Fornecedor"
        content="Você tem certeza de que deseja remover este fornecedor?"
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
            data={suppliers}
            searchParam="name"
            onSearchResult={setFilteredResults}
          />
          {suppliers_create && (
            <Button
              onClick={() => push("/suppliers/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {suppliers.length > 0 && (
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        )}
      </div>

      {suppliers.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum fornecedor cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
