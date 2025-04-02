"use client"

import { ExpenseCategory } from "@/@types/expense-category"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { deleteExpenseGroup } from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { useExpenseGroupQuery } from "@/modules/expenses-components/expense-groups-components/remote/use-expense-groups-query"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseGroupTable() {
  const { push } = useRouter()
  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.["expense_groups_create"]
  const edit = permissions?.["expense_groups_edit"]
  const deletePermission = permissions?.["expense_groups_delete"]

  const account_id = getAccountId()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const {
    data: expenseGroups,
    isLoading,
    refetch,
  } = useExpenseGroupQuery(account_id)

  const handleEdit = (id: string) => {
    push(`/expense-groups/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteExpenseGroup(id)
      toast.success("Item removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "group_name" },
    {
      header: "Grupo",
      accessor: "expense_category",
      render: (value: ExpenseCategory.Type) => {
        if (value) {
          return value.name
        }
      },
    },
    {
      header: "Atualizado Em",
      accessor: "updated_at",
      render: (value: string) => formatLocalDate(new Date(value)),
    },
    {
      header: "Ações",
      accessor: "expense_group_id",
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
    if (expenseGroups) setFilteredResults(expenseGroups)
  }, [expenseGroups, isLoading])

  if (!expenseGroups || isLoading || permissionLoading) return <LoadingScreen />

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
            data={expenseGroups}
            searchParam="group_name"
            onSearchResult={setFilteredResults}
          />
          {create && (
            <Button
              onClick={() => push("/expense-groups/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {expenseGroups.length > 0 && (
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        )}
      </div>
      {expenseGroups.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum item de despesas cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
