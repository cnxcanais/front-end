"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { getAccountId } from "@/core/utils/get-account-id"
import { deleteIncomeCategory } from "@/modules/income-components/income-categories-components/remote/income-categories-methods"
import { useIncomeCategoryQuery } from "@/modules/income-components/income-categories-components/remote/use-income-categories-query"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeCategoriesTable() {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.["income_categories_create"]
  const edit = permissions?.["income_categories_edit"]
  const deletePermission = permissions?.["income_categories_delete"]

  const account_id = getAccountId()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const {
    data: incomeCategories,
    isLoading,
    refetch,
  } = useIncomeCategoryQuery(account_id)

  const handleEdit = (id: string) => {
    push(`/income-categories/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteIncomeCategory(id)
      toast.success("Grupo removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Atualizado em",
      accessor: "updated_at",
      render: (value: string) =>
        new Date(value).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "2-digit",
          year: "numeric",
          timeZone: "Europe/Paris",
        }),
    },
    {
      header: "Ações",
      accessor: "income_category_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}

          {deletePermission && (
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

  useEffect(() => {
    if (incomeCategories) setFilteredResults(incomeCategories)
  }, [incomeCategories, isLoading])

  if (!incomeCategories || isLoading || permissionLoading)
    return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Grupo"
        content="Você tem certeza de que deseja remover este grupo?"
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
            data={incomeCategories}
            searchParam="name"
            onSearchResult={setFilteredResults}
          />
          {create && (
            <Button
              onClick={() => push("/income-categories/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {incomeCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename="meu-relatorio"
              options={{ orientation: "portrait" }}
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
      {incomeCategories.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum grupo de receita cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
