"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { deleteExpenseCategory } from "@/modules/expenses-components/expense-categories-components/remote/expense-categories-methods"
import { useExpenseCategoryQuery } from "@/modules/expenses-components/expense-categories-components/remote/use-expense-categories-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseCategoriesTable() {
  const { push } = useRouter()

  const create = getPermissionByEntity("expense_categories_create")
  const edit = getPermissionByEntity("expense_categories_edit")
  const deletePermission = getPermissionByEntity("expense_categories_delete")

  const account_id = getAccountId()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const {
    data: expenseCategories,
    isLoading,
    refetch,
  } = useExpenseCategoryQuery(account_id)

  const handleEdit = (id: string) => {
    push(`/expense-categories/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteExpenseCategory(id)
      toast.success("Categoria removida com sucesso!")
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
      accessor: "expense_category_id",
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
    if (expenseCategories) setFilteredResults(expenseCategories)
  }, [expenseCategories, isLoading])

  if (!expenseCategories || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Categoria"
        content="Você tem certeza de que deseja remover esta categoria?"
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
            data={expenseCategories}
            searchParam="name"
            onSearchResult={setFilteredResults}
          />
          {create && (
            <Button
              onClick={() => push("/expense-categories/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {expenseCategories.length > 0 && (
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        )}
      </div>
      {expenseCategories.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma categoria de despesa cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
